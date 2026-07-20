import type { P11ReadinessCategory } from "./scale-reliability-readiness-types";

export const reliabilityBaselinePolicy: P11ReadinessCategory[] = [
  {
    key: "idempotency_retries",
    label: "Idempotency, retry, backoff, and deduplication",
    status: "in_progress",
    summary:
      "Provider paths must stay idempotent, bounded, observable, and safe to retry before queue runtime expansion.",
    workspaceScoped: true,
    aggregateFirst: true,
    mutationEnabled: false,
  },
  {
    key: "safe_fallbacks",
    label: "Failure isolation and graceful degradation",
    status: "in_progress",
    summary:
      "Failures must return safe summaries, preserve tenant isolation, and avoid leaking provider/customer data.",
    workspaceScoped: true,
    aggregateFirst: true,
    mutationEnabled: false,
  },
];

export function getReliabilityBaselinePolicy(): P11ReadinessCategory[] {
  return reliabilityBaselinePolicy;
}
