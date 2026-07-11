import { clampGmailInboundSyncMaxMessages } from "./gmail-inbound-sync-service";
import {
  clampGmailInboundSyncSchedulerMaxAccountsPerTick,
  type GmailInboundSyncSchedulerService,
} from "./gmail-inbound-sync-scheduler-service";
import type {
  GmailInboundSyncSchedulerRuntimeConfig,
  GmailInboundSyncSchedulerRuntimeTickResult,
} from "./gmail-inbound-sync-scheduler-runtime-types";

export const DEFAULT_GMAIL_INBOUND_SYNC_SCHEDULER_INTERVAL_MS = 300_000;
export const MIN_GMAIL_INBOUND_SYNC_SCHEDULER_INTERVAL_MS = 60_000;

export function clampGmailInboundSyncSchedulerIntervalMs(
  value: number | undefined,
): number {
  if (value === undefined || !Number.isFinite(value)) {
    return DEFAULT_GMAIL_INBOUND_SYNC_SCHEDULER_INTERVAL_MS;
  }

  return Math.max(
    Math.trunc(value),
    MIN_GMAIL_INBOUND_SYNC_SCHEDULER_INTERVAL_MS,
  );
}

export class GmailInboundSyncSchedulerRuntimeService {
  private timer: ReturnType<typeof setInterval> | undefined;
  private tickInFlight = false;

  constructor(
    private readonly scheduler: Pick<
      GmailInboundSyncSchedulerService,
      "tickOnce"
    >,
    private readonly config: GmailInboundSyncSchedulerRuntimeConfig = {},
  ) {}

  start(): boolean {
    if (this.config.enabled !== true) {
      return false;
    }

    if (this.timer) {
      return true;
    }

    this.timer = setInterval(() => {
      void this.tickNow();
    }, this.getIntervalMs());
    this.timer.unref?.();

    return true;
  }

  stop(): void {
    if (!this.timer) {
      return;
    }

    clearInterval(this.timer);
    this.timer = undefined;
  }

  isRunning(): boolean {
    return this.timer !== undefined;
  }

  async tickNow(
    input: { now?: Date } = {},
  ): Promise<GmailInboundSyncSchedulerRuntimeTickResult> {
    const startedAt = input.now ?? new Date();

    if (this.config.enabled !== true) {
      return this.createResult("disabled", startedAt, "runtime_disabled");
    }

    if (this.tickInFlight) {
      return this.createResult("skipped", startedAt, "tick_already_running", 1);
    }

    this.tickInFlight = true;

    try {
      return await this.scheduler.tickOnce({
        now: startedAt,
        maxAccountsPerTick: this.getMaxAccountsPerTick(),
        maxMessagesPerAccount: this.getMaxMessagesPerAccount(),
      });
    } catch {
      return this.createResult("failed", startedAt, "tick_failed", 0, 1);
    } finally {
      this.tickInFlight = false;
    }
  }

  getIntervalMs(): number {
    return clampGmailInboundSyncSchedulerIntervalMs(this.config.intervalMs);
  }

  getMaxAccountsPerTick(): number {
    return clampGmailInboundSyncSchedulerMaxAccountsPerTick(
      this.config.maxAccountsPerTick,
    );
  }

  getMaxMessagesPerAccount(): number {
    return clampGmailInboundSyncMaxMessages(this.config.maxMessagesPerAccount);
  }

  private createResult(
    status: GmailInboundSyncSchedulerRuntimeTickResult["status"],
    startedAt: Date,
    reasonCode: GmailInboundSyncSchedulerRuntimeTickResult["reason_code"],
    skippedCount = 0,
    failedCount = 0,
  ): GmailInboundSyncSchedulerRuntimeTickResult {
    const finishedAt = new Date();

    return {
      status,
      checked_account_count: 0,
      scheduled_job_count: 0,
      skipped_count: skippedCount,
      failed_count: failedCount,
      started_at: startedAt.toISOString(),
      finished_at: finishedAt.toISOString(),
      ...(reasonCode !== undefined ? { reason_code: reasonCode } : {}),
    };
  }
}
