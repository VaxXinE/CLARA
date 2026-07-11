import { describe, expect, it, vi } from "vitest";
import type { GmailInboundMessageDto } from "../src/channels/email/gmail-inbound-message-fetch-types";
import { FixtureGmailInboundSyncStateRepository } from "../src/channels/email/gmail-inbound-sync-state-repository";
import { GmailInboundSyncStateService } from "../src/channels/email/gmail-inbound-sync-state-service";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
import type { EmailInboundMaterializer } from "../src/channels/email/email-inbound-materialization-types";
import { GmailMessageNormalizationService } from "../src/channels/email/gmail-message-normalization-service";
import type { GmailNormalizedInboundEmailPersister } from "../src/channels/email/gmail-message-normalization-types";
import {
  GmailInboundSyncService,
  type GmailConnectionHealthChecker,
  type GmailInboundMessageFetcher,
} from "../src/channels/email/gmail-inbound-sync-service";
import { ValidationError } from "../src/errors/app-error";

async function createScopedAccount() {
  const accounts = new FixtureGmailProviderAccountRepository();

  await accounts.createAccount({
    id: "gmail_account_demo",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    provider: "gmail",
    emailAddress: "agent.gmail@example.test",
    displayName: "Demo Agent Gmail",
    status: "connected",
    scopes: ["gmail.readonly"],
    tokenReferenceId: "gmail_token_ref_demo",
    lastVerifiedAt: new Date("2026-07-10T09:00:00.000Z"),
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    updatedAt: new Date("2026-07-10T09:00:00.000Z"),
    metadata: {
      connectionOrigin: "manual",
    },
  });

  return accounts;
}

function createSyncStateService() {
  return new GmailInboundSyncStateService(
    new FixtureGmailInboundSyncStateRepository(),
  );
}

describe("GmailInboundSyncService", () => {
  it("fetches bounded messages for a healthy account and returns safe summary only", async () => {
    const accounts = await createScopedAccount();
    const healthService: GmailConnectionHealthChecker = {
      checkHealth: vi.fn(async () => ({
        provider_account_id: "gmail_account_demo",
        provider: "gmail" as const,
        status: "healthy" as const,
        reason_code: "ok" as const,
        checked_at: "2026-07-10T12:00:00.000Z",
      })),
    };
    const fetchService: GmailInboundMessageFetcher = {
      listMessages: vi.fn(async (input) => {
        expect(input.maxResults).toBe(25);

        return {
          items: [
            {
              provider_message_id: "msg_001",
              thread_id: "thr_001",
              label_ids: ["INBOX"],
            },
            {
              provider_message_id: "msg_002",
              thread_id: "thr_001",
              label_ids: ["UNREAD"],
            },
          ],
          next_page_token: "page_2",
        };
      }),
      getMessage: vi.fn(async (input) => ({
        provider_message_id: input.providerMessageId,
        thread_id: "thr_001",
        label_ids: ["INBOX"],
        snippet: "safe snippet",
      })),
    };
    const service = new GmailInboundSyncService(
      accounts,
      healthService,
      fetchService,
      {
        state: createSyncStateService(),
      },
    );

    const result = await service.syncMessages({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      maxMessages: 999,
      now: new Date("2026-07-10T12:00:00.000Z"),
    });

    expect(result).toEqual({
      provider_account_id: "gmail_account_demo",
      provider: "gmail",
      status: "completed",
      fetched_count: 2,
      normalized_count: 0,
      persisted_count: 0,
      materialized_count: 0,
      skipped_count: 0,
      failed_count: 0,
      next_page_token: "page_2",
      reason_code: "sync_completed",
      synced_at: "2026-07-10T12:00:00.000Z",
    });
    expect(JSON.stringify(result)).not.toContain("safe snippet");
    expect(fetchService.getMessage).toHaveBeenCalledTimes(2);
  });

  it("skips unhealthy accounts safely and rejects missing or cross-workspace accounts", async () => {
    const accounts = await createScopedAccount();
    const service = new GmailInboundSyncService(
      accounts,
      {
        checkHealth: vi.fn(async () => ({
          provider_account_id: "gmail_account_demo",
          provider: "gmail" as const,
          status: "action_required" as const,
          reason_code: "provider_rejected" as const,
          checked_at: "2026-07-10T12:00:00.000Z",
        })),
      } as GmailConnectionHealthChecker,
      {
        listMessages: vi.fn(),
        getMessage: vi.fn(),
      } as GmailInboundMessageFetcher,
      {
        state: createSyncStateService(),
      },
    );

    expect(
      await service.syncMessages({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_demo",
      }),
    ).toMatchObject({
      status: "skipped",
      reason_code: "connection_unhealthy",
      fetched_count: 0,
      normalized_count: 0,
      persisted_count: 0,
      materialized_count: 0,
      skipped_count: 0,
      failed_count: 0,
    });

    await expect(
      service.syncMessages({
        organizationId: "org_other",
        workspaceId: "wks_other",
        providerAccountId: "gmail_account_demo",
      }),
    ).rejects.toThrow("Gmail provider account not found.");
  });

  it("returns partial or failed results safely when provider fetches fail", async () => {
    const accounts = await createScopedAccount();
    const service = new GmailInboundSyncService(
      accounts,
      {
        checkHealth: vi.fn(async () => ({
          provider_account_id: "gmail_account_demo",
          provider: "gmail" as const,
          status: "healthy" as const,
          reason_code: "ok" as const,
          checked_at: "2026-07-10T12:00:00.000Z",
        })),
      } as GmailConnectionHealthChecker,
      {
        listMessages: vi.fn(async () => ({
          items: [
            {
              provider_message_id: "msg_ok",
              label_ids: [],
            },
            {
              provider_message_id: "msg_bad",
              label_ids: [],
            },
          ],
        })),
        getMessage: vi.fn(async (input) => {
          if (input.providerMessageId === "msg_bad") {
            throw new Error("provider raw detail should stay hidden");
          }

          return {
            provider_message_id: "msg_ok",
            label_ids: [],
          };
        }),
      } as GmailInboundMessageFetcher,
      {
        state: createSyncStateService(),
      },
    );

    expect(
      await service.syncMessages({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_demo",
      }),
    ).toMatchObject({
      status: "partial",
      fetched_count: 1,
      normalized_count: 0,
      persisted_count: 0,
      materialized_count: 0,
      failed_count: 1,
      reason_code: "message_fetch_failed",
    });

    const failedService = new GmailInboundSyncService(
      accounts,
      {
        checkHealth: vi.fn(async () => ({
          provider_account_id: "gmail_account_demo",
          provider: "gmail" as const,
          status: "healthy" as const,
          reason_code: "ok" as const,
          checked_at: "2026-07-10T12:00:00.000Z",
        })),
      } as GmailConnectionHealthChecker,
      {
        listMessages: vi.fn(async () => {
          throw new ValidationError("Invalid request.");
        }),
        getMessage: vi.fn(),
      } as GmailInboundMessageFetcher,
      {
        state: createSyncStateService(),
      },
    );

    expect(
      await failedService.syncMessages({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_demo",
      }),
    ).toMatchObject({
      status: "failed",
      fetched_count: 0,
      normalized_count: 0,
      persisted_count: 0,
      materialized_count: 0,
      failed_count: 0,
      reason_code: "provider_fetch_failed",
    });
  });

  it("can normalize, persist, and materialize safely with duplicate skips counted once per item", async () => {
    const accounts = await createScopedAccount();
    const persistedEnvelopes: unknown[] = [];
    const persistence: GmailNormalizedInboundEmailPersister = {
      persistNormalizedEmail: vi.fn(async ({ envelope }) => {
        persistedEnvelopes.push(envelope);

        return {
          alreadyProcessed: envelope.provider_message_id === "msg_duplicate",
        };
      }),
    };
    const materialization: EmailInboundMaterializer = {
      materialize: vi.fn(async ({ envelope }) => ({
        customerId: "cust_demo",
        conversationId: "conv_demo",
        activityId: "act_demo",
        alreadyProcessed: envelope.provider_message_id === "msg_duplicate",
      })),
    };
    const service = new GmailInboundSyncService(
      accounts,
      {
        checkHealth: vi.fn(async () => ({
          provider_account_id: "gmail_account_demo",
          provider: "gmail" as const,
          status: "healthy" as const,
          reason_code: "ok" as const,
          checked_at: "2026-07-10T12:00:00.000Z",
        })),
      } as GmailConnectionHealthChecker,
      {
        listMessages: vi.fn(async () => ({
          items: [
            {
              provider_message_id: "msg_persisted",
              thread_id: "thr_001",
              label_ids: ["INBOX"],
            },
            {
              provider_message_id: "msg_duplicate",
              thread_id: "thr_001",
              label_ids: ["INBOX"],
            },
          ],
        })),
        getMessage: vi.fn(async (input): Promise<GmailInboundMessageDto> => ({
          provider_message_id: input.providerMessageId,
          thread_id: "thr_001",
          label_ids: ["INBOX"],
          snippet: "Safe preview only",
          payload: {
            headers: [
              {
                name: "From",
                value: "customer@example.test",
              },
              {
                name: "To",
                value: "support@example.test",
              },
              {
                name: "Subject",
                value: "Help needed",
              },
              {
                name: "Message-ID",
                value: `<${input.providerMessageId}@example.test>`,
              },
            ],
            parts: [
              {
                mime_type: "text/plain",
                headers: [],
                body_size: 20,
              },
              {
                filename: "proof.pdf",
                attachment_id: "att_001",
                headers: [],
                body_size: 10,
              },
            ],
          },
        })),
      } as GmailInboundMessageFetcher,
      {
        normalization: new GmailMessageNormalizationService(),
        persistence,
        materialization,
        state: createSyncStateService(),
      },
    );

    const result = await service.syncMessages({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      persistNormalized: true,
      materializeConversation: true,
      now: new Date("2026-07-10T12:00:00.000Z"),
    });

    expect(result).toMatchObject({
      status: "partial",
      fetched_count: 2,
      normalized_count: 2,
      persisted_count: 1,
      materialized_count: 1,
      skipped_count: 1,
      failed_count: 0,
    });
    expect(persistedEnvelopes).toHaveLength(2);
    expect(JSON.stringify(persistedEnvelopes)).not.toContain("Authorization");
    expect(JSON.stringify(persistedEnvelopes)).not.toContain("access_token");
    expect(JSON.stringify(persistedEnvelopes)).not.toContain("refresh_token");
    expect(JSON.stringify(persistedEnvelopes)).not.toContain("attachment data");
    expect(JSON.stringify(persistedEnvelopes)).not.toContain("conversationId");
    expect(JSON.stringify(persistedEnvelopes)).not.toContain("customerId");
    expect(materialization.materialize).toHaveBeenCalledTimes(2);
  });

  it("updates scoped sync state on completed, partial, and failed runs", async () => {
    const accounts = await createScopedAccount();
    const state = createSyncStateService();

    const completed = new GmailInboundSyncService(
      accounts,
      {
        checkHealth: vi.fn(async () => ({
          provider_account_id: "gmail_account_demo",
          provider: "gmail" as const,
          status: "healthy" as const,
          reason_code: "ok" as const,
          checked_at: "2026-07-11T12:00:00.000Z",
        })),
      } as GmailConnectionHealthChecker,
      {
        listMessages: vi.fn(async () => ({
          items: [{ provider_message_id: "msg_ok", label_ids: [] }],
        })),
        getMessage: vi.fn(async (): Promise<GmailInboundMessageDto> => ({
          provider_message_id: "msg_ok",
          label_ids: [],
        })),
      } as GmailInboundMessageFetcher,
      {
        state,
      },
    );

    await completed.syncMessages({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-11T12:00:00.000Z"),
    });

    const afterCompleted = await state.getByProviderAccountScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "gmail_account_demo",
    );
    expect(afterCompleted).toMatchObject({
      lastSyncStatus: "completed",
      lastFailureReasonCode: null,
      lastFetchedCount: 1,
    });

    const partial = new GmailInboundSyncService(
      accounts,
      {
        checkHealth: vi.fn(async () => ({
          provider_account_id: "gmail_account_demo",
          provider: "gmail" as const,
          status: "healthy" as const,
          reason_code: "ok" as const,
          checked_at: "2026-07-11T12:10:00.000Z",
        })),
      } as GmailConnectionHealthChecker,
      {
        listMessages: vi.fn(async () => ({
          items: [
            { provider_message_id: "msg_ok", label_ids: [] },
            { provider_message_id: "msg_bad", label_ids: [] },
          ],
        })),
        getMessage: vi.fn(async (input): Promise<GmailInboundMessageDto> => {
          if (input.providerMessageId === "msg_bad") {
            throw new Error("hidden");
          }

          return {
            provider_message_id: "msg_ok",
            label_ids: [],
          };
        }),
      } as GmailInboundMessageFetcher,
      {
        state,
      },
    );

    await partial.syncMessages({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-11T12:10:00.000Z"),
    });

    const afterPartial = await state.getByProviderAccountScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "gmail_account_demo",
    );
    expect(afterPartial).toMatchObject({
      lastSyncStatus: "partial",
      lastFailureReasonCode: "message_fetch_failed",
    });

    const failed = new GmailInboundSyncService(
      accounts,
      {
        checkHealth: vi.fn(async () => ({
          provider_account_id: "gmail_account_demo",
          provider: "gmail" as const,
          status: "action_required" as const,
          reason_code: "provider_rejected" as const,
          checked_at: "2026-07-11T12:20:00.000Z",
        })),
      } as GmailConnectionHealthChecker,
      {
        listMessages: vi.fn(),
        getMessage: vi.fn(),
      } as GmailInboundMessageFetcher,
      {
        state,
      },
    );

    await failed.syncMessages({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-11T12:20:00.000Z"),
    });

    const afterFailed = await state.getByProviderAccountScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "gmail_account_demo",
    );
    expect(afterFailed).toMatchObject({
      lastSyncStatus: "failed",
      lastFailureReasonCode: "connection_unhealthy",
    });
  });
});
