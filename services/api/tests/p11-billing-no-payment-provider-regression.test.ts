import { describe, expect, it } from "vitest";
import { getBillingReadinessPolicy } from "../src/billing/billing-readiness-policy";
import { getPaymentProviderBoundaryPolicy } from "../src/billing/payment-provider-boundary-policy";

describe("P11 billing no payment provider regression", () => {
  it("does not integrate payment provider SDK behavior", () => {
    expect(getBillingReadinessPolicy().paymentProviderIntegrated).toBe(false);
    expect(getPaymentProviderBoundaryPolicy().providerSdkIntegrated).toBe(
      false,
    );
  });
});
