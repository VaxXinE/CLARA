import type {
  MultichannelAuditMetadata,
  MultichannelAuditProvider,
} from "./multichannel-audit-policy-types";

export const multichannelAuditMetadataAllowlist = [
  "provider",
  "channel",
  "source",
  "channel_account_id",
  "conversation_id",
  "customer_id",
  "delivery_id",
  "outbound_delivery_id",
  "snapshot_hash",
  "reason_code",
  "status",
  "direction",
  "correlation_id",
  "recipient_count",
  "message_count",
  "incoming_count",
  "outgoing_count",
  "has_attachments",
  "html_body_present",
] as const;

const allowed = new Set<string>(multichannelAuditMetadataAllowlist);

export const multichannelAuditProviders: MultichannelAuditProvider[] = [
  "gmail",
  "email",
  "webchat",
  "whatsapp",
  "instagram",
  "tiktok",
  "extension",
];

export function sanitizeMultichannelAuditMetadata(
  input: Record<string, unknown>,
): MultichannelAuditMetadata {
  const output: MultichannelAuditMetadata = {};

  for (const [key, value] of Object.entries(input)) {
    if (!allowed.has(key)) {
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
