import { describe, expect, it } from "vitest";
import { getPlanCatalogReadinessPolicy } from "../src/billing/plan-catalog-readiness-policy";
import { getSubscriptionLifecycleBoundaryPolicy } from "../src/billing/subscription-lifecycle-boundary-policy";

describe("P11 billing no subscription mutation regression", () => {
  it("does not mutate subscriptions, plans, upgrades, downgrades, or cancellations", () => {
    expect(
      getSubscriptionLifecycleBoundaryPolicy().cancellationImplemented,
    ).toBe(false);
    expect(getPlanCatalogReadinessPolicy()).toMatchObject({
      planMutationImplemented: false,
      upgradeImplemented: false,
      downgradeImplemented: false,
      cancellationImplemented: false,
    });
  });
});
