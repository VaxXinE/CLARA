import { describe, expect, it } from "vitest";
import {
  getBillingReadinessControls,
  getBillingReadinessPolicy,
} from "../src/billing/billing-readiness-policy";

describe("P11 billing readiness policy", () => {
  it("defines billing as readiness only, not launch", () => {
    expect(getBillingReadinessPolicy()).toEqual({
      billingPolicyDefined: true,
      paymentProviderBoundaryDefined: true,
      invoiceBoundaryDefined: true,
      subscriptionBoundaryDefined: true,
      chargingImplemented: false,
      invoiceCreationImplemented: false,
      paymentProviderIntegrated: false,
      paymentMethodStorageImplemented: false,
    });
  });

  it("includes safe controls for billing, plan catalog, and entitlement readiness", () => {
    const labels = getBillingReadinessControls().map(
      (control) => control.label,
    );

    expect(labels).toContain("Billing Readiness");
    expect(labels).toContain("Plan Catalog");
    expect(labels).toContain("Plan Entitlement");
  });
});
