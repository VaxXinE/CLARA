export const providerChannelAuditEventTypes = [
  "provider_account_connected",
  "provider_account_disconnected",
  "provider_account_reconnect_required",
  "provider_token_refresh_failed_safe",
  "channel_health_checked",
  "webhook_received_safe",
  "webhook_rejected_safe",
  "webhook_replay_detected",
  "outbound_queued",
  "outbound_sending",
  "outbound_sent",
  "outbound_retry_scheduled",
  "outbound_dead_lettered",
  "provider_policy_blocked",
  "extension_snapshot_received_safe",
  "extension_snapshot_rejected_safe",
] as const;

export type ProviderChannelAuditEventType =
  (typeof providerChannelAuditEventTypes)[number];

export type ProviderChannelAuditRecord = {
  eventType: ProviderChannelAuditEventType;
  workspaceId: string;
  userId?: string;
  channel: string;
  provider: string;
  accountId?: string;
  correlationId: string;
  safeReasonCode: string;
  createdAt: string;
  metadata: ProviderChannelAuditMetadata;
};

export type ProviderChannelAuditMetadata = Record<
  string,
  string | number | boolean | null
>;

const providerChannelAuditMetadataAllowlist = new Set([
  "provider",
  "channel",
  "account_id",
  "conversation_id",
  "delivery_id",
  "outbound_delivery_id",
  "snapshot_hash",
  "status",
  "safe_reason_code",
  "reason_code",
  "correlation_id",
  "retry_count",
  "dead_letter_count",
  "recipient_count",
  "message_count",
]);

export function sanitizeProviderChannelAuditMetadata(
  input: Record<string, unknown>,
): ProviderChannelAuditMetadata {
  const output: ProviderChannelAuditMetadata = {};

  for (const [key, value] of Object.entries(input)) {
    if (!providerChannelAuditMetadataAllowlist.has(key)) {
      continue;
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      output[key] = value;
    }
  }

  return output;
}
