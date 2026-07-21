import { buildPerformanceCapacitySafeSummary } from "./performance-capacity-safe-summary";
import { getCapacityPlanningBaselinePolicy } from "./capacity-planning-baseline-policy";
import { getLoadTestProfilePolicy } from "./load-test-profile-policy";
import {
  getPerformanceReadinessControls,
  getPerformanceReadinessPolicy,
} from "./performance-readiness-policy";
import { getPerformanceRiskClassificationPolicy } from "./performance-risk-classification-policy";
import type {
  PerformanceCapacityReadinessResponse,
  PerformanceReadinessInput,
} from "./performance-readiness-types";

export function toPerformanceCapacityReadinessDto(
  input: PerformanceReadinessInput,
): PerformanceCapacityReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: (input.generatedAt ?? new Date()).toISOString(),
    phase: "p11",
    performanceReadiness: getPerformanceReadinessPolicy(),
    loadTestReadiness: getLoadTestProfilePolicy(),
    capacityPlanning: getCapacityPlanningBaselinePolicy(),
    riskClassification: getPerformanceRiskClassificationPolicy(),
    safeBenchmarkSummary: buildPerformanceCapacitySafeSummary(),
    controls: getPerformanceReadinessControls(),
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
}
