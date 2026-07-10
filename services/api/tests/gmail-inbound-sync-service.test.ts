import { describe, expect, it, vi } from "vitest";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
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
      failed_count: 0,
      reason_code: "provider_fetch_failed",
    });
  });
});
