import { describe, expect, it } from "vitest";
import { PlanCatalogReadinessService } from "../src/billing/plan-catalog-readiness-service";

describe("P11 plan catalog readiness service", () => {
  it("returns policy-only plan catalog readiness", () => {
    expect(new PlanCatalogReadinessService().getReadiness()).toMatchObject({
      planCatalogPolicyDefined: true,
      planMutationImplemented: false,
      upgradeImplemented: false,
      downgradeImplemented: false,
    });
  });
});
