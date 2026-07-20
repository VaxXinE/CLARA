import type { P11ReadinessCategory } from "./scale-reliability-readiness-types";

export const capacityPerformanceTargetPolicy: P11ReadinessCategory[] = [
  {
    key: "capacity_targets",
    label: "Capacity and performance targets",
    status: "planned",
    summary:
      "Capacity targets require explicit load-test runbooks; heavy load tests must not run in normal unit/build flows.",
    workspaceScoped: true,
    aggregateFirst: true,
    mutationEnabled: false,
  },
];

export function getCapacityPerformanceTargetPolicy(): P11ReadinessCategory[] {
  return capacityPerformanceTargetPolicy;
}
