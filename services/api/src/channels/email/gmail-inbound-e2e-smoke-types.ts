export const gmailInboundE2ESmokeStatuses = ["passed", "failed"] as const;

export type GmailInboundE2ESmokeStatus =
  (typeof gmailInboundE2ESmokeStatuses)[number];

export type GmailInboundE2ESmokeReasonCode =
  | "ok"
  | "no_messages"
  | "connection_unhealthy"
  | "provider_fetch_failed"
  | "message_fetch_failed";

export type GmailInboundE2ESmokeResultDto = {
  status: GmailInboundE2ESmokeStatus;
  provider_account_id: string;
  fetched_count: number;
  normalized_count: number;
  persisted_count: number;
  materialized_count: number;
  skipped_count: number;
  failed_count: number;
  checked_at: string;
  reason_code?: GmailInboundE2ESmokeReasonCode;
};

export type GmailInboundE2ESmokeInput = {
  organizationId: string;
  workspaceId: string;
  providerAccountId: string;
  maxMessages?: number;
  pageToken?: string;
  query?: string;
  labelIds?: string[];
  now?: Date;
};
