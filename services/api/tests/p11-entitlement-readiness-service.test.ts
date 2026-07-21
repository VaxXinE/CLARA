import { describe, expect, it } from "vitest";
import { EntitlementReadinessService } from "../src/billing/entitlement-readiness-service";

describe("P11 entitlement readiness service", () => {
  it("returns policy-only entitlement readiness", () => {
    expect(new EntitlementReadinessService().getReadiness()).toMatchObject({
      entitlementPolicyDefined: true,
      featureGatePolicyDefined: true,
      entitlementMutationImplemented: false,
      hardEnforcementImplemented: false,
    });
  });
});
