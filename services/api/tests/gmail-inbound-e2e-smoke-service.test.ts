import { describe, expect, it, vi } from "vitest";
import { FixtureActivityRepository } from "../src/activity/activity-repository";
import type { GmailApiClient } from "../src/channels/email/gmail-api-client";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import { NotFoundError } from "../src/errors/app-error";
import { EmailInboundMaterializationService } from "../src/channels/email/email-inbound-materialization-service";
import { EmailInboundPersistenceService } from "../src/channels/email/email-inbound-persistence-service";
import { FixtureEmailInboundRepository } from "../src/channels/email/email-inbound-repository";
import { ScopedGmailApiAccessTokenProvider } from "../src/channels/email/gmail-api-access-token-provider";
import type {
  GmailApiRequestInput,
  GmailUsersProfileResponse,
} from "../src/channels/email/gmail-api-client-types";
import { buildGmailProviderAccount } from "../src/channels/email/gmail-auth-types";
import { GmailConnectionHealthService } from "../src/channels/email/gmail-connection-health-service";
import { GmailInboundE2ESmokeService } from "../src/channels/email/gmail-inbound-e2e-smoke-service";
import type { GmailInboundMessageDto } from "../src/channels/email/gmail-inbound-message-fetch-types";
import {
  GmailInboundSyncService,
  type GmailInboundMessageFetcher,
} from "../src/channels/email/gmail-inbound-sync-service";
import { GmailMessageNormalizationService } from "../src/channels/email/gmail-message-normalization-service";
import type {
  GmailNormalizedInboundEmailPersister,
  PersistGmailNormalizedInboundEmailInput,
} from "../src/channels/email/gmail-message-normalization-types";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
import { GmailProfileVerificationService } from "../src/channels/email/gmail-profile-verification-service";
import { MockGmailTokenVault } from "../src/channels/email/mock-gmail-token-vault";

const scope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
} as const;

class FixtureNormalizedInboundEmailPersister implements GmailNormalizedInboundEmailPersister {
  private readonly processed = new Set<string>();

  async persistNormalizedEmail(
    input: PersistGmailNormalizedInboundEmailInput,
  ): Promise<{ alreadyProcessed: boolean }> {
    const scopedKey = [
      input.scope.organizationId,
      input.scope.workspaceId,
      input.envelope.provider,
      input.envelope.provider_message_id,
    ].join(":");

    if (this.processed.has(scopedKey)) {
      return {
        alreadyProcessed: true,
      };
    }

    this.processed.add(scopedKey);

    return {
      alreadyProcessed: false,
    };
  }
}

function createGmailApiClient(
  implementation: (
    input: GmailApiRequestInput,
  ) => Promise<GmailUsersProfileResponse>,
): GmailApiClient {
  return {
    requestJson: vi.fn(
      async <T>(input: GmailApiRequestInput): Promise<T> =>
        (await implementation(input)) as T,
    ) as GmailApiClient["requestJson"],
  };
}

async function createHarness(options?: {
  healthStatus?: "healthy" | "action_required";
}) {
  const store = createFixtureAppStore();
  const inboundRepository = new FixtureEmailInboundRepository(store);
  const accounts = new FixtureGmailProviderAccountRepository();
  const tokenVault = new MockGmailTokenVault();
  const tokenReference = await tokenVault.storeTokenReference({
    organizationId: scope.organizationId,
    workspaceId: scope.workspaceId,
    accountId: "gmail_account_demo",
    scopes: ["gmail.readonly"],
    tokenGrant: {
      accessToken: "atk",
      refreshToken: "rtk",
      expiresAt: new Date("2099-01-01T00:00:00.000Z"),
    },
  });

  await accounts.createAccount(
    buildGmailProviderAccount({
      id: "gmail_account_demo",
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      emailAddress: "agent.gmail@example.test",
      displayName: "Demo Gmail",
      scopes: ["gmail.readonly"],
      tokenReferenceId: tokenReference.referenceId,
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "test",
      },
      createdAt: new Date("2026-07-10T12:00:00.000Z"),
    }),
  );

  const gmailApiClient = createGmailApiClient(async () => ({
    emailAddress: "agent.gmail@example.test",
    historyId: "h-smoke",
  }));

  const health =
    options?.healthStatus === "action_required"
      ? {
          checkHealth: vi.fn(async () => ({
            provider_account_id: "gmail_account_demo",
            provider: "gmail" as const,
            status: "action_required" as const,
            reason_code: "access_token_expired" as const,
            checked_at: "2026-07-11T10:00:00.000Z",
          })),
        }
      : new GmailConnectionHealthService(
          accounts,
          tokenVault,
          new GmailProfileVerificationService(
            accounts,
            new ScopedGmailApiAccessTokenProvider(accounts, tokenVault),
            gmailApiClient,
          ),
        );

  const fetch: GmailInboundMessageFetcher = {
    listMessages: vi.fn(async () => ({
      items: [
        {
          provider_message_id: "gmail_smoke_msg_001",
          thread_id: "gmail_smoke_thread_001",
          label_ids: ["INBOX", "UNREAD"],
          snippet: "Need help with setup",
        },
      ],
    })),
    getMessage: vi.fn(async (): Promise<GmailInboundMessageDto> => ({
      provider_message_id: "gmail_smoke_msg_001",
      thread_id: "gmail_smoke_thread_001",
      label_ids: ["INBOX", "UNREAD"],
      snippet: "Need help with setup",
      payload: {
        headers: [
          {
            name: "From",
            value: '"Smoke Customer" <customer.smoke@example.test>',
          },
          {
            name: "To",
            value: "agent.gmail@example.test",
          },
          {
            name: "Subject",
            value: "Need help with setup",
          },
          {
            name: "Message-ID",
            value: "<gmail_smoke_msg_001@example.test>",
          },
        ],
        parts: [
          {
            mime_type: "text/plain",
            headers: [],
            body_size: 24,
          },
          {
            filename: "proof.pdf",
            attachment_id: "att_demo",
            headers: [],
            body_size: 10,
          },
        ],
      },
    })),
  };

  const sync = new GmailInboundSyncService(accounts, health, fetch, {
    normalization: new GmailMessageNormalizationService(),
    persistence: new FixtureNormalizedInboundEmailPersister(),
    materialization: new EmailInboundMaterializationService(
      new EmailInboundPersistenceService(inboundRepository),
    ),
  });

  return {
    store,
    fetch,
    smoke: new GmailInboundE2ESmokeService(sync),
    conversations: new FixtureConversationRepository(store),
    customers: new FixtureCustomerRepository(store),
    activity: new FixtureActivityRepository(store),
  };
}

describe("GmailInboundE2ESmokeService", () => {
  it("runs the full scoped inbound smoke flow offline", async () => {
    const harness = await createHarness();

    const result = await harness.smoke.runSmoke({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-11T10:00:00.000Z"),
    });

    expect(result).toMatchObject({
      status: "passed",
      provider_account_id: "gmail_account_demo",
      fetched_count: 1,
      normalized_count: 1,
      persisted_count: 1,
      materialized_count: 1,
      skipped_count: 0,
      failed_count: 0,
      checked_at: "2026-07-11T10:00:00.000Z",
      reason_code: "ok",
    });
    expect(JSON.stringify(result)).not.toContain("atk");
    expect(JSON.stringify(result)).not.toContain("rtk");
    expect(JSON.stringify(result)).not.toContain("Authorization");
    expect(JSON.stringify(harness.store)).not.toContain("att_demo");

    const customer = await harness.customers.findByIdScoped(
      scope,
      harness.store.emailInboundRecords.at(-1)?.customerId ?? "",
    );
    const conversation = await harness.conversations.findByIdScoped(
      scope,
      harness.store.emailInboundRecords.at(-1)?.conversationId ?? "",
    );
    const activityItems = await harness.activity.listByConversationScoped(
      scope,
      harness.store.emailInboundRecords.at(-1)?.conversationId ?? "",
    );

    expect(customer?.contactIdentifier).toBe("customer.smoke@example.test");
    expect(conversation?.messages.at(-1)?.body).toBe("Need help with setup");
    expect(activityItems.at(-1)?.eventType).toBe("email_received");
  });

  it("is idempotent on rerun and returns passed with skips", async () => {
    const harness = await createHarness();

    const first = await harness.smoke.runSmoke({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      providerAccountId: "gmail_account_demo",
    });
    const second = await harness.smoke.runSmoke({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      providerAccountId: "gmail_account_demo",
    });

    expect(first.status).toBe("passed");
    expect(second).toMatchObject({
      status: "passed",
      fetched_count: 1,
      normalized_count: 1,
      persisted_count: 0,
      materialized_count: 0,
      skipped_count: 1,
      failed_count: 0,
      reason_code: "ok",
    });
  });

  it("returns safe failed status for unhealthy accounts and keeps fetch path unused", async () => {
    const harness = await createHarness({
      healthStatus: "action_required",
    });

    const result = await harness.smoke.runSmoke({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-11T10:00:00.000Z"),
    });

    expect(result).toMatchObject({
      status: "failed",
      provider_account_id: "gmail_account_demo",
      fetched_count: 0,
      normalized_count: 0,
      persisted_count: 0,
      materialized_count: 0,
      skipped_count: 0,
      failed_count: 0,
      reason_code: "connection_unhealthy",
    });
    expect(harness.fetch.listMessages).not.toHaveBeenCalled();
  });

  it("rejects cross-workspace account access safely", async () => {
    const harness = await createHarness();

    await expect(
      harness.smoke.runSmoke({
        organizationId: "org_other",
        workspaceId: "wks_other",
        providerAccountId: "gmail_account_demo",
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
