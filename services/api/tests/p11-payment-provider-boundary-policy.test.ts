import { describe, expect, it } from "vitest";
import { getPaymentProviderBoundaryPolicy } from "../src/billing/payment-provider-boundary-policy";

describe("P11 payment provider boundary policy", () => {
  it("keeps payment providers unintegrated in billing readiness", () => {
    expect(getPaymentProviderBoundaryPolicy()).toEqual({
      paymentProviderBoundaryDefined: true,
      providerSdkIntegrated: false,
      checkoutSessionImplemented: false,
      chargeExecutionImplemented: false,
      paymentMethodStorageImplemented: false,
      providerWebhookImplemented: false,
    });
  });
});
