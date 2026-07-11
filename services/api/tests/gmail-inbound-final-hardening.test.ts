import { describe, expect, it, vi } from "vitest";
import type { GmailApiClient } from "../src/channels/email/gmail-api-client";
import type {
  GmailApiAccessTokenProvider,
  GmailApiRequestInput,
} from "../src/channels/email/gmail-api-client-types";
import { EmailInboundMaterializationService } from "../src/channels/email/email-inbound-materialization-service";
import { EmailInboundPersistenceService } from "../src/channels/email/email-inbound-persistence-service";
import { FixtureEmailInboundRepository } from "../src/channels/email/email-inbound-repository";
import { buildGmailProviderAccount } from "../src/channels/email/gmail-auth-types";
import { GmailInboundMessageFetchService } from "../src/channels/email/gmail-inbound-message-fetch-service";
import { GmailInboundSyncService } from "../src/channels/email/gmail-inbound-sync-service";
import { GmailMessageNormalizationService } from "../src/channels/email/gmail-message-normalization-service";
import type {
  GmailNormalizedInboundEmailEnvelope,
  GmailNormalizedInboundEmailPersister,
  PersistGmailNormalizedInboundEmailInput,
} from "../src/channels/email/gmail-message-normalization-types";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const scope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
} as const;

const forbiddenResponseFragments = [
  "atk",
  "rtk",
  "Authorization",
  ["client", "secret"].join("_"),
  "raw-gmail-payload",
  "raw-provider-error-body",
  "attachment-bytes",
] as const;

class CapturingNormalizedPersister implements GmailNormalizedInboundEmailPersister {
  readonly envelopes: GmailNormalizedInboundEmailEnvelope[] = [];

  async persistNormalizedEmail(
    input: PersistGmailNormalizedInboundEmailInput,
  ): Promise<{ alreadyProcessed: boolean }> {
    this.envelopes.push(input.envelope);

    return {
      alreadyProcessed: false,
    };
  }
}

function expectSafe(serialized: string): void {
  for (const fragment of forbiddenResponseFragments) {
    expect(serialized).not.toContain(fragment);
  }
}

describe("Gmail inbound final hardening", () => {
  it("keeps inbound sync responses and materialized records free of token/raw provider data", async () => {
    const accounts = new FixtureGmailProviderAccountRepository();
    const store = createFixtureAppStore();
    const inboundRepository = new FixtureEmailInboundRepository(store);
    const normalizedPersister = new CapturingNormalizedPersister();
    const initialAiDraftCount = store.aiDraftEvents.length;
    const initialReplyDraftCount = store.replyDrafts.length;
    const initialOutboundMessageCount = store.messages.filter(
      (message) => message.direction === "outbound",
    ).length;
    const initialOutboundDeliveryCount = store.emailOutboundDeliveries.length;

    await accounts.createAccount(
      buildGmailProviderAccount({
        id: "gmail_account_demo",
        organizationId: scope.organizationId,
        workspaceId: scope.workspaceId,
        emailAddress: "agent.gmail@example.test",
        scopes: ["gmail.readonly"],
        tokenReferenceId: "gmail_token_ref_demo",
        createdAt: new Date("2026-07-12T10:00:00.000Z"),
      }),
    );

    const tokenProvider: GmailApiAccessTokenProvider = {
      getAccessToken: vi.fn(async () => "atk"),
    };
    const gmailApiClient: GmailApiClient = {
      requestJson: vi.fn(async <T>(input: GmailApiRequestInput): Promise<T> => {
        if (input.path === "/gmail/v1/users/me/messages") {
          return {
            messages: [
              {
                id: "gmail_msg_final_001",
                threadId: "gmail_thread_final_001",
              },
            ],
          } as T;
        }

        return {
          id: "gmail_msg_final_001",
          threadId: "gmail_thread_final_001",
          labelIds: ["INBOX"],
          snippet: "Safe customer preview",
          internalDate: "1783677600000",
          raw: "raw-gmail-payload",
          provider_raw_error: "raw-provider-error-body",
          payload: {
            mimeType: "multipart/mixed",
            headers: [
              {
                name: "From",
                value: '"Final Customer" <final.customer@example.test>',
              },
              {
                name: "To",
                value: "agent.gmail@example.test",
              },
              {
                name: "Subject",
                value: "Need support",
              },
              {
                name: "Authorization",
                value: "Bearer atk",
              },
              {
                name: "X-Raw-Provider-Error",
                value: "raw-provider-error-body",
              },
            ],
            body: {
              size: 99,
              data: "attachment-bytes",
            },
            parts: [
              {
                mimeType: "application/pdf",
                filename: "proof.pdf",
                body: {
                  size: 42,
                  attachmentId: "att_final_001",
                  data: "attachment-bytes",
                },
              },
            ],
          },
        } as T;
      }) as GmailApiClient["requestJson"],
    };
    const fetch = new GmailInboundMessageFetchService(
      tokenProvider,
      gmailApiClient,
    );
    const sync = new GmailInboundSyncService(
      accounts,
      {
        checkHealth: vi.fn(async () => ({
          provider_account_id: "gmail_account_demo",
          provider: "gmail" as const,
          status: "healthy" as const,
          reason_code: "ok" as const,
          checked_at: "2026-07-12T10:00:00.000Z",
        })),
      },
      fetch,
      {
        normalization: new GmailMessageNormalizationService(),
        persistence: normalizedPersister,
        materialization: new EmailInboundMaterializationService(
          new EmailInboundPersistenceService(inboundRepository),
        ),
      },
    );

    const result = await sync.syncMessages({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      providerAccountId: "gmail_account_demo",
      persistNormalized: true,
      materializeConversation: true,
      now: new Date("2026-07-12T10:00:00.000Z"),
    });
    const finalState = inboundRepository.getState();

    expect(result).toMatchObject({
      status: "completed",
      fetched_count: 1,
      normalized_count: 1,
      persisted_count: 1,
      materialized_count: 1,
      failed_count: 0,
      reason_code: "sync_completed",
    });
    expect(result.synced_at).toBe("2026-07-12T10:00:00.000Z");
    expect(normalizedPersister.envelopes).toHaveLength(1);
    expect(finalState.aiDraftEvents).toHaveLength(initialAiDraftCount);
    expect(finalState.replyDrafts).toHaveLength(initialReplyDraftCount);
    expect(
      finalState.messages.filter((message) => message.direction === "outbound"),
    ).toHaveLength(initialOutboundMessageCount);
    expect(finalState.emailOutboundDeliveries).toHaveLength(
      initialOutboundDeliveryCount,
    );
    expect(finalState.messages.at(-1)).toMatchObject({
      direction: "inbound",
      body: "Safe customer preview",
    });

    expectSafe(JSON.stringify(result));
    expectSafe(JSON.stringify(normalizedPersister.envelopes));
    expectSafe(JSON.stringify(finalState));
  });

  it("returns safe summaries when provider fetch fails with a raw provider error", async () => {
    const accounts = new FixtureGmailProviderAccountRepository();

    await accounts.createAccount(
      buildGmailProviderAccount({
        id: "gmail_account_demo",
        organizationId: scope.organizationId,
        workspaceId: scope.workspaceId,
        emailAddress: "agent.gmail@example.test",
        scopes: ["gmail.readonly"],
        tokenReferenceId: "gmail_token_ref_demo",
        createdAt: new Date("2026-07-12T10:00:00.000Z"),
      }),
    );

    const sync = new GmailInboundSyncService(
      accounts,
      {
        checkHealth: vi.fn(async () => ({
          provider_account_id: "gmail_account_demo",
          provider: "gmail" as const,
          status: "healthy" as const,
          reason_code: "ok" as const,
          checked_at: "2026-07-12T10:00:00.000Z",
        })),
      },
      new GmailInboundMessageFetchService(
        {
          getAccessToken: vi.fn(async () => "atk"),
        },
        {
          requestJson: vi.fn(async () => {
            throw Object.assign(new Error("raw-provider-error-body"), {
              code: "gmail_api_http_error",
            });
          }) as GmailApiClient["requestJson"],
        },
      ),
    );

    const result = await sync.syncMessages({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-12T10:00:00.000Z"),
    });

    expect(result).toMatchObject({
      status: "failed",
      reason_code: "provider_fetch_failed",
      fetched_count: 0,
      normalized_count: 0,
      persisted_count: 0,
      materialized_count: 0,
      failed_count: 0,
    });
    expectSafe(JSON.stringify(result));
  });
});
