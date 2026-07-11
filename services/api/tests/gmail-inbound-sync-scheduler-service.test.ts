import { describe, expect, it, vi } from "vitest";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
import { FixtureGmailInboundSyncStateRepository } from "../src/channels/email/gmail-inbound-sync-state-repository";
import { GmailInboundSyncStateService } from "../src/channels/email/gmail-inbound-sync-state-service";
import { GmailInboundSyncSchedulerService } from "../src/channels/email/gmail-inbound-sync-scheduler-service";
import type { GmailInboundSyncJobService } from "../src/channels/email/gmail-inbound-sync-job-service";

async function createAccounts() {
  const accounts = new FixtureGmailProviderAccountRepository();
  const base = new Date("2026-07-11T10:00:00.000Z");

  for (const id of ["one", "two", "three"]) {
    await accounts.createAccount({
      id: `gmail_account_${id}`,
      organizationId: "org_demo",
      workspaceId: `wks_${id}`,
      provider: "gmail",
      emailAddress: `${id}@example.test`,
      displayName: `Account ${id}`,
      status: "connected",
      scopes: ["gmail.readonly"],
      tokenReferenceId: `ref_${id}`,
      lastVerifiedAt: base,
      createdAt: base,
      updatedAt: base,
      metadata: {
        connectionOrigin: "manual",
      },
    });
  }

  return accounts;
}

function createJobService(
  runJob = vi.fn(async () => ({
    provider_account_id: "gmail_account_one",
    provider: "gmail" as const,
    trigger: "scheduler_preview" as const,
    status: "completed" as const,
    fetched_count: 1,
    normalized_count: 1,
    persisted_count: 1,
    materialized_count: 0,
    skipped_count: 0,
    failed_count: 0,
    started_at: "2026-07-11T11:00:00.000Z",
    finished_at: "2026-07-11T11:01:00.000Z",
  })),
): Pick<GmailInboundSyncJobService, "runJob"> {
  return {
    runJob,
  };
}

describe("GmailInboundSyncSchedulerService", () => {
  it("no-ops when disabled", async () => {
    const accounts = await createAccounts();
    const state = new GmailInboundSyncStateService(
      new FixtureGmailInboundSyncStateRepository(),
    );
    const jobs = createJobService();
    const scheduler = new GmailInboundSyncSchedulerService(
      accounts,
      state,
      jobs,
      { enabled: false },
    );

    const result = await scheduler.tickOnce({
      now: new Date("2026-07-11T11:00:00.000Z"),
    });

    expect(result).toMatchObject({
      status: "disabled",
      checked_account_count: 0,
      scheduled_job_count: 0,
      reason_code: "scheduler_disabled",
    });
    expect(jobs.runJob).not.toHaveBeenCalled();
  });

  it("runs eligible accounts through the job boundary with clamped limits", async () => {
    const accounts = await createAccounts();
    const state = new GmailInboundSyncStateService(
      new FixtureGmailInboundSyncStateRepository(),
    );
    const jobs = createJobService();
    const scheduler = new GmailInboundSyncSchedulerService(
      accounts,
      state,
      jobs,
      {
        enabled: true,
        maxAccountsPerTick: 2,
        maxMessagesPerAccount: 999,
      },
    );

    const result = await scheduler.tickOnce({
      now: new Date("2026-07-11T11:00:00.000Z"),
    });

    expect(result).toMatchObject({
      status: "completed",
      checked_account_count: 2,
      scheduled_job_count: 2,
      skipped_count: 0,
      failed_count: 0,
    });
    expect(jobs.runJob).toHaveBeenCalledTimes(2);
    expect(jobs.runJob).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: "scheduler_preview",
        maxMessages: 25,
      }),
    );
  });

  it("skips accounts with running sync state", async () => {
    const accounts = await createAccounts();
    const state = new GmailInboundSyncStateService(
      new FixtureGmailInboundSyncStateRepository(),
    );
    await state.markStarted({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_one",
      },
      providerAccountId: "gmail_account_one",
      now: new Date("2026-07-11T11:00:00.000Z"),
    });
    const jobs = createJobService();
    const scheduler = new GmailInboundSyncSchedulerService(
      accounts,
      state,
      jobs,
      { enabled: true },
    );

    const result = await scheduler.tickOnce({
      now: new Date("2026-07-11T11:01:00.000Z"),
    });

    expect(result).toMatchObject({
      checked_account_count: 3,
      scheduled_job_count: 2,
      skipped_count: 1,
    });
    expect(jobs.runJob).toHaveBeenCalledTimes(2);
  });

  it("returns partial when one job fails safely", async () => {
    const accounts = await createAccounts();
    const state = new GmailInboundSyncStateService(
      new FixtureGmailInboundSyncStateRepository(),
    );
    const jobs = createJobService(
      vi
        .fn()
        .mockResolvedValueOnce({
          provider_account_id: "gmail_account_one",
          provider: "gmail",
          trigger: "scheduler_preview",
          status: "completed",
          fetched_count: 1,
          normalized_count: 1,
          persisted_count: 1,
          materialized_count: 0,
          skipped_count: 0,
          failed_count: 0,
          started_at: "2026-07-11T11:00:00.000Z",
          finished_at: "2026-07-11T11:01:00.000Z",
        })
        .mockResolvedValueOnce({
          provider_account_id: "gmail_account_two",
          provider: "gmail",
          trigger: "scheduler_preview",
          status: "failed",
          reason_code: "provider_fetch_failed",
          fetched_count: 0,
          normalized_count: 0,
          persisted_count: 0,
          materialized_count: 0,
          skipped_count: 0,
          failed_count: 1,
          started_at: "2026-07-11T11:00:00.000Z",
          finished_at: "2026-07-11T11:01:00.000Z",
        }),
    );
    const scheduler = new GmailInboundSyncSchedulerService(
      accounts,
      state,
      jobs,
      {
        enabled: true,
        maxAccountsPerTick: 2,
      },
    );

    const result = await scheduler.tickOnce({
      now: new Date("2026-07-11T11:00:00.000Z"),
    });

    expect(result).toMatchObject({
      status: "partial",
      checked_account_count: 2,
      scheduled_job_count: 2,
      failed_count: 1,
    });
    expect(JSON.stringify(result)).not.toContain("access_token");
    expect(JSON.stringify(result)).not.toContain("refresh_token");
    expect(JSON.stringify(result)).not.toContain("Authorization");
    expect(JSON.stringify(result)).not.toContain("payload");
  });
});
