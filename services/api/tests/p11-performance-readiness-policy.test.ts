import { describe, expect, it } from "vitest";
import { getPerformanceReadinessPolicy } from "../src/reliability/performance-readiness-policy";

describe("P11 performance readiness policy", () => {
  it("defines performance targets without allowing default heavy load execution", () => {
    expect(getPerformanceReadinessPolicy()).toEqual({
      latencyTargetDefined: true,
      throughputTargetDefined: true,
      errorRateTargetDefined: true,
      timeoutBoundaryDefined: true,
      requestSizeBoundaryDefined: true,
      gracefulDegradationDefined: true,
      heavyLoadTestExecutedByDefault: false,
      productionTargetAllowed: false,
    });
  });
});
