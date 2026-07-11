import { clampGmailInboundSyncMaxMessages } from "./gmail-inbound-sync-service";
import {
  clampGmailInboundSyncSchedulerMaxAccountsPerTick,
  type GmailInboundSyncSchedulerService,
} from "./gmail-inbound-sync-scheduler-service";
import type {
  GmailInboundSyncSchedulerRuntimeConfig,
  GmailInboundSyncSchedulerRuntimeStatusDto,
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
  private lastStartedAt: string | undefined;
  private lastStoppedAt: string | undefined;
  private lastTickStartedAt: string | undefined;
  private lastTickFinishedAt: string | undefined;
  private lastTickStatus:
    GmailInboundSyncSchedulerRuntimeTickResult["status"] | undefined;
  private lastReasonCode:
    GmailInboundSyncSchedulerRuntimeTickResult["reason_code"] | undefined;

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

    this.lastStartedAt = new Date().toISOString();
    this.lastStoppedAt = undefined;
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
    this.lastStoppedAt = new Date().toISOString();
  }

  isRunning(): boolean {
    return this.timer !== undefined;
  }

  async tickNow(
    input: {
      now?: Date;
      maxAccountsPerTick?: number;
      maxMessagesPerAccount?: number;
    } = {},
  ): Promise<GmailInboundSyncSchedulerRuntimeTickResult> {
    const startedAt = input.now ?? new Date();
    this.lastTickStartedAt = startedAt.toISOString();

    if (this.config.enabled !== true) {
      const result = this.createResult(
        "disabled",
        startedAt,
        "runtime_disabled",
      );
      this.recordTickResult(result);

      return result;
    }

    if (this.tickInFlight) {
      const result = this.createResult(
        "skipped",
        startedAt,
        "tick_already_running",
        1,
      );
      this.recordTickResult(result);

      return result;
    }

    this.tickInFlight = true;

    try {
      const result = await this.scheduler.tickOnce({
        now: startedAt,
        maxAccountsPerTick: this.getMaxAccountsPerTick(
          input.maxAccountsPerTick,
        ),
        maxMessagesPerAccount: this.getMaxMessagesPerAccount(
          input.maxMessagesPerAccount,
        ),
      });
      this.recordTickResult(result);

      return result;
    } catch {
      const result = this.createResult(
        "failed",
        startedAt,
        "tick_failed",
        0,
        1,
      );
      this.recordTickResult(result);

      return result;
    } finally {
      this.tickInFlight = false;
    }
  }

  getStatus(): GmailInboundSyncSchedulerRuntimeStatusDto {
    return {
      scheduler_enabled: this.config.enabled === true,
      scheduler_running: this.isRunning(),
      interval_ms: this.getIntervalMs(),
      max_accounts_per_tick: this.getMaxAccountsPerTick(),
      max_messages_per_account: this.getMaxMessagesPerAccount(),
      ...(this.lastStartedAt !== undefined
        ? { last_started_at: this.lastStartedAt }
        : {}),
      ...(this.lastStoppedAt !== undefined
        ? { last_stopped_at: this.lastStoppedAt }
        : {}),
      ...(this.lastTickStartedAt !== undefined
        ? { last_tick_started_at: this.lastTickStartedAt }
        : {}),
      ...(this.lastTickFinishedAt !== undefined
        ? { last_tick_finished_at: this.lastTickFinishedAt }
        : {}),
      ...(this.lastTickStatus !== undefined
        ? { last_tick_status: this.lastTickStatus }
        : {}),
      ...(this.lastReasonCode !== undefined
        ? { last_reason_code: this.lastReasonCode }
        : {}),
    };
  }

  getIntervalMs(): number {
    return clampGmailInboundSyncSchedulerIntervalMs(this.config.intervalMs);
  }

  getMaxAccountsPerTick(value = this.config.maxAccountsPerTick): number {
    return clampGmailInboundSyncSchedulerMaxAccountsPerTick(value);
  }

  getMaxMessagesPerAccount(value = this.config.maxMessagesPerAccount): number {
    return clampGmailInboundSyncMaxMessages(value);
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

  private recordTickResult(
    result: GmailInboundSyncSchedulerRuntimeTickResult,
  ): void {
    this.lastTickFinishedAt = result.finished_at;
    this.lastTickStatus = result.status;
    this.lastReasonCode = result.reason_code;
  }
}
