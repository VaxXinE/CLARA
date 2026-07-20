import type { QueueJobReliabilityControl } from "./queue-job-reliability-types";

export function getQueueJobReliabilityControls(): QueueJobReliabilityControl[] {
  return [
    {
      controlKey: "queue_reliability_policy",
      label: "Queue reliability policy",
      description:
        "Queue reliability is policy-defined before any worker or job runner is launched.",
      status: "ready",
      severity: "info",
      evidenceType: "policy",
    },
    {
      controlKey: "retry_backoff_policy",
      label: "Retry and backoff hardening",
      description:
        "Retries require bounded attempts, exponential backoff, jitter, and provider rate-limit respect.",
      status: "ready",
      severity: "warning",
      evidenceType: "runtime_guardrail",
    },
    {
      controlKey: "idempotency_policy",
      label: "Idempotency hardening",
      description:
        "Idempotency keys and workspace-scoped deduplication are required before replay or retry execution.",
      status: "ready",
      severity: "critical",
      evidenceType: "test",
    },
    {
      controlKey: "dead_letter_readiness",
      label: "Dead Letter readiness",
      description:
        "Poison messages require a safe review state; destructive purge is not implemented.",
      status: "planned",
      severity: "warning",
      evidenceType: "runbook",
    },
    {
      controlKey: "no_worker_execution",
      label: "No worker execution",
      description:
        "This readiness surface cannot enqueue, execute, retry, replay, purge, or schedule jobs.",
      status: "ready",
      severity: "critical",
      evidenceType: "runtime_guardrail",
    },
  ];
}
