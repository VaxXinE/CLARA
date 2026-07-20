import { getDeadLetterReadinessPolicy } from "./dead-letter-readiness-policy";
import { getIdempotencyHardeningPolicy } from "./idempotency-hardening-policy";
import { getQueueJobReliabilityControls } from "./queue-job-reliability-policy";
import type {
  QueueJobReliabilityReadinessInput,
  QueueJobReliabilityReadinessResponse,
} from "./queue-job-reliability-types";
import { buildReliabilitySafeSummary } from "./reliability-safe-summary";
import { getRetryBackoffHardeningPolicy } from "./retry-backoff-hardening-policy";

export function toQueueJobReliabilityReadinessDto(
  input: QueueJobReliabilityReadinessInput,
): QueueJobReliabilityReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: (input.generatedAt ?? new Date()).toISOString(),
    phase: "p11",
    queueJobReliability: {
      queueReliabilityPolicyDefined: true,
      retryPolicyDefined: true,
      idempotencyPolicyDefined: true,
      deadLetterReadinessDefined: true,
      failureClassificationDefined: true,
      workerImplemented: false,
      jobExecutionImplemented: false,
      autoRetryExecutionImplemented: false,
      destructiveCleanupImplemented: false,
    },
    controls: getQueueJobReliabilityControls(),
    retryBackoff: getRetryBackoffHardeningPolicy(),
    idempotency: getIdempotencyHardeningPolicy(),
    deadLetter: getDeadLetterReadinessPolicy(),
    safety: buildReliabilitySafeSummary(),
  };
}
