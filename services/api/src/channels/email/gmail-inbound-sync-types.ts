export const gmailInboundSyncStatuses = [
  "completed",
  "partial",
  "skipped",
  "failed",
] as const;

export const gmailInboundSyncReasonCodes = [
  "connection_unhealthy",
  "provider_fetch_failed",
  "message_fetch_failed",
  "no_messages",
  "sync_completed",
] as const;

export type GmailInboundSyncStatus = (typeof gmailInboundSyncStatuses)[number];

export type GmailInboundSyncReasonCode =
  (typeof gmailInboundSyncReasonCodes)[number];

export type GmailInboundSyncResultDto = {
  provider_account_id: string;
  provider: "gmail";
  status: GmailInboundSyncStatus;
  fetched_count: number;
  normalized_count: number;
  persisted_count: number;
  materialized_count: number;
  skipped_count: number;
  failed_count: number;
  next_page_token?: string;
  reason_code?: GmailInboundSyncReasonCode;
  synced_at: string;
};

export type GmailInboundSyncInput = {
  organizationId: string;
  workspaceId: string;
  providerAccountId: string;
  maxMessages?: number;
  pageToken?: string;
  query?: string;
  labelIds?: string[];
  persistNormalized?: boolean;
  materializeConversation?: boolean;
  now?: Date;
};
