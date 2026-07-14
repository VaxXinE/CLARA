import type { ChannelOperationalSignal } from "./channel-operational-event-types";
import { sanitizeChannelDiagnostics } from "./channel-safe-diagnostics";

export const channelObservabilitySignals = [
  "channel",
  "provider",
  "workspace scope",
  "status",
  "readiness level",
  "last health check time",
  "safe reason code",
  "retry count",
  "dead-letter count",
  "webhook accepted/rejected count",
  "outbound lifecycle count",
  "provider degraded/outage state",
  "correlation id",
] as const;

export function buildChannelOperationalSignal(
  input: ChannelOperationalSignal,
): ChannelOperationalSignal {
  const safe = sanitizeChannelDiagnostics(input);

  return {
    channel: String(safe.channel),
    provider: String(safe.provider),
    workspaceId: String(safe.workspaceId),
    status: input.status,
    readinessLevel: input.readinessLevel,
    safeReasonCode: String(safe.safeReasonCode),
    correlationId: String(safe.correlationId),
    ...(safe.lastHealthCheckedAt !== undefined
      ? { lastHealthCheckedAt: String(safe.lastHealthCheckedAt) }
      : {}),
    ...(typeof safe.retryCount === "number"
      ? { retryCount: safe.retryCount }
      : {}),
    ...(typeof safe.deadLetterCount === "number"
      ? { deadLetterCount: safe.deadLetterCount }
      : {}),
    ...(typeof safe.webhookAcceptedCount === "number"
      ? { webhookAcceptedCount: safe.webhookAcceptedCount }
      : {}),
    ...(typeof safe.webhookRejectedCount === "number"
      ? { webhookRejectedCount: safe.webhookRejectedCount }
      : {}),
    ...(typeof safe.outboundQueuedCount === "number"
      ? { outboundQueuedCount: safe.outboundQueuedCount }
      : {}),
    ...(typeof safe.outboundSendingCount === "number"
      ? { outboundSendingCount: safe.outboundSendingCount }
      : {}),
    ...(typeof safe.outboundSentCount === "number"
      ? { outboundSentCount: safe.outboundSentCount }
      : {}),
    ...(typeof safe.outboundFailedCount === "number"
      ? { outboundFailedCount: safe.outboundFailedCount }
      : {}),
    ...(typeof safe.outboundRetryingCount === "number"
      ? { outboundRetryingCount: safe.outboundRetryingCount }
      : {}),
    ...(typeof safe.outboundDeadLetterCount === "number"
      ? { outboundDeadLetterCount: safe.outboundDeadLetterCount }
      : {}),
  };
}
