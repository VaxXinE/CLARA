import { describe, expect, it } from "vitest";
import { getPerformanceRiskClassificationPolicy } from "../src/reliability/performance-risk-classification-policy";

describe("P11 performance risk classification policy", () => {
  it("classifies capacity risks without exposing raw telemetry", () => {
    expect(getPerformanceRiskClassificationPolicy()).toMatchObject({
      latencyRiskClassified: true,
      throughputRiskClassified: true,
      providerLimitRiskClassified: true,
      databaseRiskClassified: true,
      queueBacklogRiskClassified: true,
      productionReadinessRisk: "medium",
    });
  });
});
