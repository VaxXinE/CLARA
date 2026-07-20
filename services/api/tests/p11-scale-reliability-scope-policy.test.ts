import { describe, expect, it } from "vitest";
import { getP11ScaleReliabilityScopePolicy } from "../src/reliability/p11-scale-reliability-scope-policy";

describe("P11 scale reliability scope policy", () => {
  it("defines readiness scope without launch or mutation behavior", () => {
    const policy = getP11ScaleReliabilityScopePolicy();

    expect(policy.title).toBe("P11 Scale / Reliability / Billing");
    expect(policy.readinessNotLaunch).toBe(true);
    expect(policy.categories[0]).toMatchObject({
      workspaceScoped: true,
      aggregateFirst: true,
      mutationEnabled: false,
    });
    expect(policy.safety).toMatchObject({
      noPaymentProviderIntegration: true,
      noChargingCustomers: true,
      noInvoiceCreation: true,
      noSubscriptionMutation: true,
      noQuotaEnforcement: true,
      noCrmMutation: true,
      noOutboundSend: true,
      noRealAiProvider: true,
    });
  });
});
