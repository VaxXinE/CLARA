export type WebhookSafeReasonCode =
  | "invalid_signature"
  | "invalid_verify_token"
  | "unsupported_provider"
  | "invalid_payload"
  | "duplicate_replay"
  | "rate_limited"
  | "payload_too_large"
  | "webhook_rejected";

export type WebhookSafeError = {
  safeReasonCode: WebhookSafeReasonCode;
  message: string;
};

const SAFE_MESSAGES: Record<WebhookSafeReasonCode, string> = {
  invalid_signature: "Webhook signature is invalid.",
  invalid_verify_token: "Webhook verification token is invalid.",
  unsupported_provider: "Webhook provider is not supported.",
  invalid_payload: "Webhook payload is invalid.",
  duplicate_replay: "Webhook event was already processed.",
  rate_limited: "Webhook request rate limit was exceeded.",
  payload_too_large: "Webhook payload is too large.",
  webhook_rejected: "Webhook request was rejected.",
};

export function toSafeWebhookError(
  safeReasonCode: WebhookSafeReasonCode,
): WebhookSafeError {
  return {
    safeReasonCode,
    message: SAFE_MESSAGES[safeReasonCode],
  };
}
