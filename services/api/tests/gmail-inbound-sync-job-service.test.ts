import { describe, expect, it, vi } from "vitest";
import { FixtureGmailInboundSyncStateRepository } from "../src/channels/email/gmail-inbound-sync-state-repository";
import { GmailInboundSyncStateService } from "../src/channels/email/gmail-inbound-sync-state-service";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
import { GmailInboundSyncJobService } from "../src/channels/email/gmail-inbound-sync-job-service";
import type { GmailInboundSyncService } from "../src/channels/email/gmail-inbound-sync-service";

async function createAccounts() {
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
    lastVerifiedAt: new Date("2026-07-11T10:00:00.000Z"),
    createdAt: new Date("2026-07-11T10:00:00.000Z"),
    updatedAt: new Date("2026-07-11T10:00:00.000Z"),
    metadata: {
      connectionOrigin: "manual",
      historyId: "h123",
    },
  });

  return accounts;
}

function buildSyncService(
  implementation?: Partial<Pick<GmailInboundSyncService, "syncMessages">>,
): Pick<GmailInboundSyncService, "syncMessages"> {
  return {
    syncMessages:
      implementation?.syncMessages ??
      vi.fn(async () => ({
        provider_account_id: "gmail_account_demo",
        provider: "gmail" as const,
        status: "completed" as const,
        fetched_count: 2,
        normalized_count: 1,
        persisted_count: 1,
        materialized_count: 0,
        skipped_count: 0,
        failed_count: 0,
        last_history_id: "h123",
        sync_state: {
          status: "completed" as const,
          last_started_at: "2026-07-11T11:00:00.000Z",
          last_completed_at: "2026-07-11T11:01:00.000Z",
          last_failed_at: null,
          last_failure_reason_code: null,
        },
        synced_at: "2026-07-11T11:01:00.000Z",
      })),
  };
}

describe("GmailInboundSyncJobService", () => {
  it("runs a healthy scoped sync job successfully", async () => {
    const accounts = await createAccounts();
    const state = new GmailInboundSyncStateService(
      new FixtureGmailInboundSyncStateRepository(),
    );
    const sync = buildSyncService();
    const service = new GmailInboundSyncJobService(accounts, state, sync);

    const result = await service.runJob({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      trigger: "manual",
      now: new Date("2026-07-11T11:00:00.000Z"),
    });

    expect(result).toEqual({
      provider_account_id: "gmail_account_demo",
      provider: "gmail",
      trigger: "manual",
      status: "completed",
      fetched_count: 2,
      normalized_count: 1,
      persisted_count: 1,
      materialized_count: 0,
      skipped_count: 0,
      failed_count: 0,
      started_at: "2026-07-11T11:00:00.000Z",
      finished_at: "2026-07-11T11:01:00.000Z",
    });
  });

  it("skips safely when scoped sync state is already running", async () => {
    const accounts = await createAccounts();
    const state = new GmailInboundSyncStateService(
      new FixtureGmailInboundSyncStateRepository(),
    );
    await state.markStarted({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-11T11:00:00.000Z"),
    });
    const sync = buildSyncService();
    const service = new GmailInboundSyncJobService(accounts, state, sync);

    const result = await service.runJob({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      trigger: "scheduler_preview",
      now: new Date("2026-07-11T11:01:00.000Z"),
    });

    expect(result).toMatchObject({
      status: "skipped",
      skipped_count: 1,
      failed_count: 0,
    });
    expect(sync.syncMessages).not.toHaveBeenCalled();
  });

  it("fails closed for missing or cross-workspace accounts", async () => {
    const accounts = await createAccounts();
    const state = new GmailInboundSyncStateService(
      new FixtureGmailInboundSyncStateRepository(),
    );
    const service = new GmailInboundSyncJobService(
      accounts,
      state,
      buildSyncService(),
    );

    await expect(
      service.runJob({
        organizationId: "org_other",
        workspaceId: "wks_other",
        providerAccountId: "gmail_account_demo",
        trigger: "manual",
      }),
    ).rejects.toThrow("Gmail provider account not found.");
  });

  it("clamps max_messages before calling sync service", async () => {
    const accounts = await createAccounts();
    const state = new GmailInboundSyncStateService(
      new FixtureGmailInboundSyncStateRepository(),
    );
    const sync = buildSyncService();
    const service = new GmailInboundSyncJobService(accounts, state, sync);

    await service.runJob({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      trigger: "internal_smoke",
      maxMessages: 999,
    });

    expect(sync.syncMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        maxMessages: 25,
      }),
    );
  });

  it("returns safe partial and failed results without leaking provider data", async () => {
    const accounts = await createAccounts();
    const state = new GmailInboundSyncStateService(
      new FixtureGmailInboundSyncStateRepository(),
    );

    const partial = new GmailInboundSyncJobService(
      accounts,
      state,
      buildSyncService({
        syncMessages: vi.fn(async () => ({
          provider_account_id: "gmail_account_demo",
          provider: "gmail" as const,
          status: "partial" as const,
          fetched_count: 2,
          normalized_count: 2,
          persisted_count: 1,
          materialized_count: 1,
          skipped_count: 1,
          failed_count: 1,
          reason_code: "message_fetch_failed" as const,
          sync_state: {
            status: "partial" as const,
            last_started_at: "2026-07-11T11:00:00.000Z",
            last_completed_at: "2026-07-11T11:01:00.000Z",
            last_failed_at: null,
            last_failure_reason_code: "message_fetch_failed" as const,
          },
          synced_at: "2026-07-11T11:01:00.000Z",
        })),
      }),
    );

    const partialResult = await partial.runJob({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      trigger: "manual",
      now: new Date("2026-07-11T11:00:00.000Z"),
    });

    expect(partialResult).toMatchObject({
      status: "partial",
      reason_code: "message_fetch_failed",
    });
    expect(JSON.stringify(partialResult)).not.toContain("access_token");
    expect(JSON.stringify(partialResult)).not.toContain("refresh_token");
    expect(JSON.stringify(partialResult)).not.toContain("Authorization");
    expect(JSON.stringify(partialResult)).not.toContain("payload");
  });
});
