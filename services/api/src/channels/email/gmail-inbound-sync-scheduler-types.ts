import type { GmailInboundSyncReasonCode } from "./gmail-inbound-sync-types";

export const gmailInboundSyncSchedulerStatuses = [
  "disabled",
  "completed",
  "partial",
  "failed",
] as const;

export type GmailInboundSyncSchedulerStatus =
  (typeof gmailInboundSyncSchedulerStatuses)[number];

export type GmailInboundSyncSchedulerConfig = {
  enabled?: boolean;
  maxAccountsPerTick?: number;
  maxMessagesPerAccount?: number;
};

export type GmailInboundSyncSchedulerTickResult = {
  status: GmailInboundSyncSchedulerStatus;
  checked_account_count: number;
  scheduled_job_count: number;
  skipped_count: number;
  failed_count: number;
  started_at: string;
  finished_at: string;
  reason_code?: GmailInboundSyncReasonCode | "scheduler_disabled";
};
