import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { BillingPlanEntitlementReadinessService } from "../src/billing/billing-readiness-service";
import { RateLimitQuotaUsageReadinessService } from "../src/reliability/rate-limit-readiness-service";

const auth = buildAuthContext({
  userId: "usr_p11_billing",
  organizationId: "org_p11",
  workspaceId: "wks_p11",
  role: "owner",
});

describe("P11 final billing no financial side effect regression", () => {
  it("keeps billing readiness separate from customer charging", () => {
    const billing = new BillingPlanEntitlementReadinessService().getReadiness({
      auth,
    });

    expect(billing.safety).toMatchObject({
      readOnly: true,
      mutationAllowed: false,
      customerCharged: false,
      invoiceCreated: false,
      paymentProviderCalled: false,
      subscriptionMutated: false,
      planMutated: false,
      entitlementMutated: false,
      quotaEnforced: false,
      usageCounterMutated: false,
      secretsIncluded: false,
    });
  });

  it("keeps usage metering readiness aggregate-only and non-enforcing", () => {
    const usage = new RateLimitQuotaUsageReadinessService().getReadiness({
      auth,
    });

    expect(usage.safety).toMatchObject({
      readOnly: true,
      mutationAllowed: false,
      quotaEnforced: false,
      quotaMutated: false,
      usageCounterMutated: false,
      subscriptionMutated: false,
      planMutated: false,
      entitlementMutated: false,
      customerCharged: false,
      invoiceCreated: false,
      paymentProviderCalled: false,
      secretsIncluded: false,
    });
  });
});
