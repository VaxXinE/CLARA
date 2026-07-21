import { describe, expect, it } from "vitest";
import { getCapacityPlanningBaselinePolicy } from "../src/reliability/capacity-planning-baseline-policy";

describe("P11 capacity planning baseline policy", () => {
  it("defines API, database, queue, dashboard, and provider capacity checks", () => {
    expect(getCapacityPlanningBaselinePolicy()).toEqual({
      capacityBaselineDefined: true,
      scalingAssumptionDefined: true,
      bottleneckChecklistDefined: true,
      databaseCapacityChecklistDefined: true,
      queueCapacityChecklistDefined: true,
      dashboardCapacityChecklistDefined: true,
      providerCapacityChecklistDefined: true,
    });
  });
});
