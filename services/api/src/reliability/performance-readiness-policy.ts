import type { PerformanceReadinessControl } from "./performance-readiness-types";

export function getPerformanceReadinessPolicy() {
  return {
    latencyTargetDefined: true,
    throughputTargetDefined: true,
    errorRateTargetDefined: true,
    timeoutBoundaryDefined: true,
    requestSizeBoundaryDefined: true,
    gracefulDegradationDefined: true,
    heavyLoadTestExecutedByDefault: false,
    productionTargetAllowed: false,
  } as const;
}

export function getPerformanceReadinessControls(): PerformanceReadinessControl[] {
  return [
    {
      controlKey: "performance_targets",
      label: "Performance targets",
      description:
        "Latency, throughput, error-rate, timeout, request-size, and graceful-degradation targets are documented before launch.",
      status: "ready",
      severity: "info",
      evidenceType: "policy",
    },
    {
      controlKey: "load_test_manual_only",
      label: "Load test execution",
      description:
        "Load tests are manual and synthetic only; normal validation does not execute heavy load tests.",
      status: "ready",
      severity: "warning",
      evidenceType: "runtime_guardrail",
    },
    {
      controlKey: "capacity_runbook",
      label: "Capacity planning",
      description:
        "Capacity planning is runbook-driven and must not target production by default.",
      status: "planned",
      severity: "warning",
      evidenceType: "runbook",
    },
  ];
}
