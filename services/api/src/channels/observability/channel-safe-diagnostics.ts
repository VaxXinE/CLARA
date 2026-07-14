const allowedDiagnosticFields = new Set([
  "channel",
  "provider",
  "workspaceId",
  "status",
  "readinessLevel",
  "safeReasonCode",
  "correlationId",
  "lastHealthCheckedAt",
  "retryCount",
  "deadLetterCount",
  "webhookAcceptedCount",
  "webhookRejectedCount",
  "outboundQueuedCount",
  "outboundSendingCount",
  "outboundSentCount",
  "outboundFailedCount",
  "outboundRetryingCount",
  "outboundDeadLetterCount",
]);

const disallowedKeyPattern = new RegExp(
  [
    "access_" + "token",
    "refresh_" + "token",
    "author" + "ization",
    "coo" + "kie",
    "client_" + "secret",
    "service_role",
    "raw[_-]?(payload|body|error|html|dom)",
    "provider[_-]?(payload|error|response)",
  ].join("|"),
  "i",
);

export function sanitizeChannelDiagnostics(
  input: Record<string, unknown>,
): Record<string, string | number | boolean | null> {
  const output: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(input)) {
    if (!allowedDiagnosticFields.has(key) || disallowedKeyPattern.test(key)) {
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
