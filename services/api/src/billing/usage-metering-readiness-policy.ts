import type { P11ReadinessCategory } from "../reliability/scale-reliability-readiness-types";

export const usageMeteringReadinessPolicy: P11ReadinessCategory[] = [
  {
    key: "usage_metering",
    label: "Usage metering readiness",
    status: "planned",
    summary:
      "Usage metering must be workspace-scoped and aggregate-first with no raw messages, provider payloads, webhook payloads, or secrets.",
    workspaceScoped: true,
    aggregateFirst: true,
    mutationEnabled: false,
  },
];

export function getUsageMeteringReadinessPolicy(): P11ReadinessCategory[] {
  return usageMeteringReadinessPolicy;
}
