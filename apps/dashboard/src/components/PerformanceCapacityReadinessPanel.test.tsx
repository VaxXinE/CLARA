import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PerformanceCapacityReadinessResponse } from "../api/types";
import { PerformanceCapacityReadinessPanel } from "./PerformanceCapacityReadinessPanel";

const readiness: PerformanceCapacityReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-21T00:00:00.000Z",
  phase: "p11",
  performanceReadiness: {
    latencyTargetDefined: true,
    throughputTargetDefined: true,
    errorRateTargetDefined: true,
    timeoutBoundaryDefined: true,
    requestSizeBoundaryDefined: true,
    gracefulDegradationDefined: true,
    heavyLoadTestExecutedByDefault: false,
    productionTargetAllowed: false,
  },
  loadTestReadiness: {
    scenarioCatalogDefined: true,
    smokeProfileDefined: true,
    baselineProfileDefined: true,
    stressProfileDefinedForManualUse: true,
    soakProfileDefinedForManualUse: true,
    ciHeavyLoadExecutionEnabled: false,
    externalProviderCallsAllowed: false,
  },
  capacityPlanning: {
    capacityBaselineDefined: true,
    scalingAssumptionDefined: true,
    bottleneckChecklistDefined: true,
    databaseCapacityChecklistDefined: true,
    queueCapacityChecklistDefined: true,
    dashboardCapacityChecklistDefined: true,
    providerCapacityChecklistDefined: true,
  },
  riskClassification: {
    latencyRiskClassified: true,
    throughputRiskClassified: true,
    providerLimitRiskClassified: true,
    databaseRiskClassified: true,
    queueBacklogRiskClassified: true,
    productionReadinessRisk: "medium",
  },
  safeBenchmarkSummary: {
    syntheticOnly: true,
    workspaceScoped: true,
    aggregateOnly: true,
    rawLogsIncluded: false,
    rawTracesIncluded: false,
    rawMetricEventsIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    secretsIncluded: false,
  },
  controls: [
    {
      controlKey: "load_test_manual_only",
      label: "Load test execution",
      description: "Load tests are manual only.",
      status: "ready",
      severity: "warning",
      evidenceType: "runtime_guardrail",
    },
  ],
  safety: {
    readOnly: true,
    mutationAllowed: false,
    loadTestExecuted: false,
    benchmarkExecuted: false,
    productionTargeted: false,
    providerCalled: false,
    paymentProviderCalled: false,
    aiProviderCalled: false,
    outboundSent: false,
    secretsIncluded: false,
  },
};

describe("PerformanceCapacityReadinessPanel", () => {
  it("renders performance, load test, capacity, and safe benchmark readiness", () => {
    render(<PerformanceCapacityReadinessPanel readiness={readiness} />);

    expect(
      screen.getByRole("region", {
        name: "Performance Capacity Readiness",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Performance / Load Test / Capacity"),
    ).toBeInTheDocument();
    expect(screen.getByText("Load test execution")).toBeInTheDocument();
    expect(screen.getByText(/Readiness, not execution/i)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render token, raw telemetry, provider payload, or execution controls", () => {
    const { container } = render(
      <PerformanceCapacityReadinessPanel readiness={readiness} />,
    );
    const text = container.textContent ?? "";

    expect(text).not.toContain("access_token");
    expect(text).not.toContain("refresh_token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("client_secret");
    expect(text).not.toContain("raw telemetry");
    expect(text).not.toContain("raw provider payload");
    expect(text).not.toContain("Run Load Test");
  });
});
