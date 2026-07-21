import { describe, expect, it } from "vitest";
import { getPerformanceReadinessPolicy } from "../src/reliability/performance-readiness-policy";

describe("P11 performance no production target regression", () => {
  it("blocks production targets by default", () => {
    expect(getPerformanceReadinessPolicy().productionTargetAllowed).toBe(false);
  });
});
