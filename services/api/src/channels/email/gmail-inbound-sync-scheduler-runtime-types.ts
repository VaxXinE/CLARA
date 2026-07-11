import type { GmailInboundSyncSchedulerTickResult } from "./gmail-inbound-sync-scheduler-types";

export const gmailInboundSyncSchedulerRuntimeStatuses = [
  "disabled",
  "completed",
  "partial",
  "failed",
  "skipped",
] as const;

export type GmailInboundSyncSchedulerRuntimeStatus =
  (typeof gmailInboundSyncSchedulerRuntimeStatuses)[number];

export type GmailInboundSyncSchedulerRuntimeReasonCode =
  "runtime_disabled" | "tick_already_running" | "tick_failed";

export type GmailInboundSyncSchedulerRuntimeConfig = {
  enabled?: boolean;
  intervalMs?: number;
  maxAccountsPerTick?: number;
  maxMessagesPerAccount?: number;
};

export type GmailInboundSyncSchedulerRuntimeStatusDto = {
  scheduler_enabled: boolean;
  scheduler_running: boolean;
  interval_ms: number;
  max_accounts_per_tick: number;
  max_messages_per_account: number;
  last_started_at?: string;
  last_stopped_at?: string;
  last_tick_started_at?: string;
  last_tick_finished_at?: string;
  last_tick_status?: GmailInboundSyncSchedulerRuntimeStatus;
  last_reason_code?: GmailInboundSyncSchedulerRuntimeReasonCode | string;
};

export type GmailInboundSyncSchedulerRuntimeTickResult = Omit<
  GmailInboundSyncSchedulerTickResult,
  "status" | "reason_code"
> & {
  status: GmailInboundSyncSchedulerRuntimeStatus;
  reason_code?: GmailInboundSyncSchedulerRuntimeReasonCode | string;
};
