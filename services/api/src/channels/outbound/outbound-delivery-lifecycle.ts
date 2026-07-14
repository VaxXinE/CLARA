import {
  getOutboundRetryDecision,
  type OutboundFailureKind,
} from "./outbound-retry-policy";
import type { OutboundSafeReasonCode } from "./outbound-safe-error";

export type OutboundDeliveryStatus =
  "queued" | "sending" | "sent" | "failed" | "retrying" | "dead_letter";

export type OutboundLifecycleResult = {
  status: OutboundDeliveryStatus;
  safeReasonCode?: OutboundSafeReasonCode;
  retryAfterMs?: number;
};

const TERMINAL_STATUSES: ReadonlySet<OutboundDeliveryStatus> = new Set([
  "sent",
  "failed",
  "dead_letter",
]);

export function beginOutboundSend(
  status: OutboundDeliveryStatus,
): OutboundLifecycleResult {
  if (TERMINAL_STATUSES.has(status)) {
    return status === "sent"
      ? {
          status,
        }
      : {
          status,
          safeReasonCode: "outbound_send_failed",
        };
  }

  return {
    status: "sending",
  };
}

export function completeOutboundAttempt(input: {
  succeeded: boolean;
  attemptNumber: number;
  maxAttempts: number;
  failureKind?: OutboundFailureKind;
}): OutboundLifecycleResult {
  if (input.succeeded) {
    return {
      status: "sent",
    };
  }

  const retry = getOutboundRetryDecision({
    attemptNumber: input.attemptNumber,
    maxAttempts: input.maxAttempts,
    failureKind: input.failureKind ?? "transient",
  });

  return {
    status: retry.nextStatus,
    safeReasonCode: retry.safeReasonCode,
    retryAfterMs: retry.backoffMs,
  };
}
