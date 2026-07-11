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

export type GmailInboundSyncSchedulerRuntimeTickResult = Omit<
  GmailInboundSyncSchedulerTickResult,
  "status" | "reason_code"
> & {
  status: GmailInboundSyncSchedulerRuntimeStatus;
  reason_code?: GmailInboundSyncSchedulerRuntimeReasonCode | string;
};
