import type { P11ReadinessCategory } from "./scale-reliability-readiness-types";

export const sloReadinessPolicy: P11ReadinessCategory[] = [
  {
    key: "availability",
    label: "Availability readiness",
    status: "planned",
    summary:
      "Availability targets and error budget language are readiness policy only; no external SLA is promised.",
    workspaceScoped: true,
    aggregateFirst: true,
    mutationEnabled: false,
  },
  {
    key: "latency",
    label: "API and dashboard latency targets",
    status: "planned",
    summary:
      "API, dashboard, webhook, job, and outbound delivery latency targets need measured evidence before launch.",
    workspaceScoped: true,
    aggregateFirst: true,
    mutationEnabled: false,
  },
];

export function getSloReadinessPolicy(): P11ReadinessCategory[] {
  return sloReadinessPolicy;
}
