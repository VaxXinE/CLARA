export type OutboundSafeReasonCode =
  | "provider_timeout"
  | "provider_rate_limited"
  | "provider_unavailable"
  | "provider_rejected"
  | "duplicate_send"
  | "max_attempts_exceeded"
  | "outbound_send_failed";

export type OutboundSafeError = {
  safeReasonCode: OutboundSafeReasonCode;
  message: string;
};

const SAFE_MESSAGES: Record<OutboundSafeReasonCode, string> = {
  provider_timeout: "Provider request timed out.",
  provider_rate_limited: "Provider rate limit was reached.",
  provider_unavailable: "Provider is temporarily unavailable.",
  provider_rejected: "Provider rejected the request.",
  duplicate_send: "Outbound send was already requested.",
  max_attempts_exceeded: "Outbound delivery exceeded max attempts.",
  outbound_send_failed: "Outbound delivery failed.",
};

export function toSafeOutboundError(
  safeReasonCode: OutboundSafeReasonCode,
): OutboundSafeError {
  return {
    safeReasonCode,
    message: SAFE_MESSAGES[safeReasonCode],
  };
}
