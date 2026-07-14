import type { OutboundSafeReasonCode } from "./outbound-safe-error";

export type OutboundFailureKind = "transient" | "permanent";

export type OutboundRetryPolicyInput = {
  attemptNumber: number;
  maxAttempts: number;
  failureKind: OutboundFailureKind;
  baseBackoffMs?: number;
};

export type OutboundRetryDecision = {
  shouldRetry: boolean;
  nextStatus: "retrying" | "failed" | "dead_letter";
  safeReasonCode: OutboundSafeReasonCode;
  backoffMs: number;
};

export function classifyOutboundProviderFailure(input: {
  statusCode?: number;
  reasonCode?: string;
}): OutboundFailureKind {
  if (
    input.reasonCode === "provider_timeout" ||
    input.reasonCode === "provider_rate_limited" ||
    input.statusCode === 408 ||
    input.statusCode === 429 ||
    (input.statusCode !== undefined && input.statusCode >= 500)
  ) {
    return "transient";
  }

  return "permanent";
}

export function getOutboundRetryDecision(
  input: OutboundRetryPolicyInput,
): OutboundRetryDecision {
  if (input.failureKind === "permanent") {
    return {
      shouldRetry: false,
      nextStatus: "failed",
      safeReasonCode: "provider_rejected",
      backoffMs: 0,
    };
  }

  if (input.attemptNumber >= input.maxAttempts) {
    return {
      shouldRetry: false,
      nextStatus: "dead_letter",
      safeReasonCode: "max_attempts_exceeded",
      backoffMs: 0,
    };
  }

  const baseBackoffMs = input.baseBackoffMs ?? 1000;

  return {
    shouldRetry: true,
    nextStatus: "retrying",
    safeReasonCode: "provider_unavailable",
    backoffMs: baseBackoffMs * 2 ** Math.max(input.attemptNumber - 1, 0),
  };
}
