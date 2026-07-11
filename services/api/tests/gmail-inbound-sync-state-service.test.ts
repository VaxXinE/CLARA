import { describe, expect, it } from "vitest";
import { FixtureGmailInboundSyncStateRepository } from "../src/channels/email/gmail-inbound-sync-state-repository";
import { GmailInboundSyncStateService } from "../src/channels/email/gmail-inbound-sync-state-service";

const scope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
} as const;

describe("GmailInboundSyncStateService", () => {
  it("creates scoped state idempotently", async () => {
    const repository = new FixtureGmailInboundSyncStateRepository();
    const service = new GmailInboundSyncStateService(repository);

    const first = await service.getOrCreateForProviderAccount({
      scope,
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-11T10:00:00.000Z"),
    });
    const second = await service.getOrCreateForProviderAccount({
      scope,
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-11T11:00:00.000Z"),
    });

    expect(first.id).toBe(second.id);
    expect(second.lastSyncStatus).toBe("idle");
  });

  it("marks started, completed, partial, failed, and cursor safely", async () => {
    const repository = new FixtureGmailInboundSyncStateRepository();
    const service = new GmailInboundSyncStateService(repository);

    await service.markStarted({
      scope,
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-11T10:00:00.000Z"),
    });

    await service.updateCursor({
      scope,
      providerAccountId: "gmail_account_demo",
      lastHistoryId: "h123",
      lastPageToken: "page_2",
      now: new Date("2026-07-11T10:01:00.000Z"),
    });

    await service.markCompleted({
      scope,
      providerAccountId: "gmail_account_demo",
      counters: {
        fetchedCount: 3,
        normalizedCount: 3,
        persistedCount: 2,
        materializedCount: 2,
      },
      lastHistoryId: "h124",
      lastPageToken: null,
      now: new Date("2026-07-11T10:02:00.000Z"),
    });

    await service.markPartial({
      scope,
      providerAccountId: "gmail_account_demo",
      counters: {
        fetchedCount: 4,
        normalizedCount: 4,
        persistedCount: 3,
        materializedCount: 2,
      },
      reasonCode: "message_fetch_failed",
      lastHistoryId: "h125",
      lastPageToken: "page_3",
      now: new Date("2026-07-11T10:03:00.000Z"),
    });

    const failed = await service.markFailed({
      scope,
      providerAccountId: "gmail_account_demo",
      reasonCode: "provider_fetch_failed",
      now: new Date("2026-07-11T10:04:00.000Z"),
    });

    expect(failed.lastSyncStatus).toBe("failed");
    expect(failed.lastFailureReasonCode).toBe("provider_fetch_failed");
    expect(failed.lastHistoryId).toBe("h125");
    expect(failed.lastPageToken).toBe("page_3");
    expect(failed.lastFetchedCount).toBe(0);
  });

  it("keeps workspace scope isolated", async () => {
    const repository = new FixtureGmailInboundSyncStateRepository();
    const service = new GmailInboundSyncStateService(repository);

    await service.getOrCreateForProviderAccount({
      scope,
      providerAccountId: "gmail_account_demo",
    });

    const other = await service.getByProviderAccountScoped(
      {
        organizationId: "org_other",
        workspaceId: "wks_other",
      },
      "gmail_account_demo",
    );

    expect(other).toBeNull();
  });

  it("rejects a second start while sync state is still running", async () => {
    const repository = new FixtureGmailInboundSyncStateRepository();
    const service = new GmailInboundSyncStateService(repository);

    await service.markStarted({
      scope,
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-11T10:00:00.000Z"),
    });

    await expect(
      service.markStarted({
        scope,
        providerAccountId: "gmail_account_demo",
        now: new Date("2026-07-11T10:01:00.000Z"),
      }),
    ).rejects.toThrow("Gmail inbound sync is already running.");
  });
});
