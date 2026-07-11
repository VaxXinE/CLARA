import { describe, expect, it, vi } from "vitest";
import {
  GmailInboundSyncSchedulerRuntimeService,
  MIN_GMAIL_INBOUND_SYNC_SCHEDULER_INTERVAL_MS,
} from "../src/channels/email/gmail-inbound-sync-scheduler-runtime-service";
import type { GmailInboundSyncSchedulerService } from "../src/channels/email/gmail-inbound-sync-scheduler-service";

function createScheduler(
  tickOnce = vi.fn(async () => ({
    status: "completed" as const,
    checked_account_count: 1,
    scheduled_job_count: 1,
    skipped_count: 0,
    failed_count: 0,
    started_at: "2026-07-11T11:00:00.000Z",
    finished_at: "2026-07-11T11:01:00.000Z",
  })),
): Pick<GmailInboundSyncSchedulerService, "tickOnce"> {
  return { tickOnce };
}

describe("GmailInboundSyncSchedulerRuntimeService", () => {
  it("does not start or tick when disabled", async () => {
    const scheduler = createScheduler();
    const runtime = new GmailInboundSyncSchedulerRuntimeService(scheduler, {
      enabled: false,
    });

    expect(runtime.start()).toBe(false);
    expect(runtime.isRunning()).toBe(false);

    const result = await runtime.tickNow({
      now: new Date("2026-07-11T11:00:00.000Z"),
    });

    expect(result).toMatchObject({
      status: "disabled",
      reason_code: "runtime_disabled",
      checked_account_count: 0,
    });
    expect(scheduler.tickOnce).not.toHaveBeenCalled();
  });

  it("starts and stops idempotently when enabled", () => {
    const runtime = new GmailInboundSyncSchedulerRuntimeService(
      createScheduler(),
      { enabled: true },
    );

    expect(runtime.start()).toBe(true);
    expect(runtime.start()).toBe(true);
    expect(runtime.isRunning()).toBe(true);

    runtime.stop();
    runtime.stop();
    expect(runtime.isRunning()).toBe(false);
  });

  it("skips overlapping ticks safely", async () => {
    let releaseTick: (() => void) | undefined;
    const tickOnce = vi.fn(
      () =>
        new Promise<
          Awaited<ReturnType<GmailInboundSyncSchedulerService["tickOnce"]>>
        >((resolve) => {
          releaseTick = () =>
            resolve({
              status: "completed",
              checked_account_count: 1,
              scheduled_job_count: 1,
              skipped_count: 0,
              failed_count: 0,
              started_at: "2026-07-11T11:00:00.000Z",
              finished_at: "2026-07-11T11:01:00.000Z",
            });
        }),
    );
    const runtime = new GmailInboundSyncSchedulerRuntimeService(
      createScheduler(tickOnce),
      { enabled: true },
    );

    const firstTick = runtime.tickNow();
    const secondTick = await runtime.tickNow({
      now: new Date("2026-07-11T11:00:01.000Z"),
    });

    expect(secondTick).toMatchObject({
      status: "skipped",
      reason_code: "tick_already_running",
      skipped_count: 1,
    });

    releaseTick?.();
    await firstTick;
    expect(tickOnce).toHaveBeenCalledTimes(1);
  });

  it("returns safe failed summary when a tick throws", async () => {
    const runtime = new GmailInboundSyncSchedulerRuntimeService(
      createScheduler(vi.fn(async () => Promise.reject(new Error("boom")))),
      { enabled: true },
    );

    const result = await runtime.tickNow({
      now: new Date("2026-07-11T11:00:00.000Z"),
    });

    expect(result).toMatchObject({
      status: "failed",
      reason_code: "tick_failed",
      failed_count: 1,
    });
    expect(JSON.stringify(result)).not.toContain("access_token");
    expect(JSON.stringify(result)).not.toContain("refresh_token");
    expect(JSON.stringify(result)).not.toContain("Authorization");
    expect(JSON.stringify(result)).not.toContain("raw Gmail");
  });

  it("clamps runtime interval and scheduler limits", async () => {
    const scheduler = createScheduler();
    const runtime = new GmailInboundSyncSchedulerRuntimeService(scheduler, {
      enabled: true,
      intervalMs: 1,
      maxAccountsPerTick: 999,
      maxMessagesPerAccount: 999,
    });

    expect(runtime.getIntervalMs()).toBe(
      MIN_GMAIL_INBOUND_SYNC_SCHEDULER_INTERVAL_MS,
    );
    expect(runtime.getMaxAccountsPerTick()).toBe(50);
    expect(runtime.getMaxMessagesPerAccount()).toBe(25);

    await runtime.tickNow({
      now: new Date("2026-07-11T11:00:00.000Z"),
    });

    expect(scheduler.tickOnce).toHaveBeenCalledWith(
      expect.objectContaining({
        maxAccountsPerTick: 50,
        maxMessagesPerAccount: 25,
      }),
    );
  });
});
