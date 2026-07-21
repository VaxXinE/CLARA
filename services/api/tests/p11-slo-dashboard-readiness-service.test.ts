import { describe, expect, it } from "vitest";
import { SloDashboardReadinessService } from "../src/reliability/slo-dashboard-readiness-service";

describe("P11 SLO dashboard readiness service", () => {
  it("returns read-only SLO dashboard readiness policy", () => {
    expect(new SloDashboardReadinessService().getReadiness()).toMatchObject({
      availabilitySloDefined: true,
      latencySloDefined: true,
      errorRateSloDefined: true,
      errorBudgetPolicyDefined: true,
      productionSlaPromised: false,
    });
  });
});
