import type {
  GmailInboundSyncReasonCode,
  GmailInboundSyncStatus,
} from "./gmail-inbound-sync-types";

export const gmailInboundSyncJobTriggers = [
  "manual",
  "internal_smoke",
  "scheduler_preview",
] as const;

export type GmailInboundSyncJobTrigger =
  (typeof gmailInboundSyncJobTriggers)[number];

export type GmailInboundSyncJobInput = {
  organizationId: string;
  workspaceId: string;
  providerAccountId: string;
  trigger: GmailInboundSyncJobTrigger;
  maxMessages?: number;
  now?: Date;
};

export type GmailInboundSyncJobResult = {
  provider_account_id: string;
  provider: "gmail";
  trigger: GmailInboundSyncJobTrigger;
  status: GmailInboundSyncStatus;
  reason_code?: GmailInboundSyncReasonCode;
  fetched_count: number;
  normalized_count: number;
  persisted_count: number;
  materialized_count: number;
  skipped_count: number;
  failed_count: number;
  started_at: string;
  finished_at: string;
};
