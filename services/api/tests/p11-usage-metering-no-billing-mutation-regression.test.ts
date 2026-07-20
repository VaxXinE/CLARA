import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { RateLimitQuotaUsageReadinessService } from "../src/reliability/rate-limit-readiness-service";

describe("P11 usage metering no billing mutation regression", () => {
  it("does not charge customers, create invoices, or mutate subscriptions", () => {
    const readiness = new RateLimitQuotaUsageReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
    });

    expect(readiness.safety.customerCharged).toBe(false);
    expect(readiness.safety.invoiceCreated).toBe(false);
    expect(readiness.safety.subscriptionMutated).toBe(false);
    expect(readiness.safety.planMutated).toBe(false);
    expect(readiness.safety.entitlementMutated).toBe(false);
    expect(readiness.safety.paymentProviderCalled).toBe(false);
  });
});
