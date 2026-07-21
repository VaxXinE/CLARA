import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { BillingPlanEntitlementReadinessService } from "../src/billing/billing-readiness-service";

describe("P11 billing readiness service", () => {
  it("returns deterministic workspace-scoped readiness", () => {
    const readiness = new BillingPlanEntitlementReadinessService().getReadiness(
      {
        auth: buildAuthContext({
          userId: "usr_demo_owner",
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          role: "owner",
        }),
        generatedAt: new Date("2026-07-21T00:00:00.000Z"),
      },
    );

    expect(readiness).toMatchObject({
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-21T00:00:00.000Z",
      phase: "p11",
      billingReadiness: {
        paymentProviderIntegrated: false,
        chargingImplemented: false,
        invoiceCreationImplemented: false,
      },
      planCatalogReadiness: {
        planCatalogPolicyDefined: true,
        planMutationImplemented: false,
      },
      entitlementReadiness: {
        entitlementPolicyDefined: true,
        hardEnforcementImplemented: false,
      },
      safety: {
        readOnly: true,
        customerCharged: false,
        invoiceCreated: false,
        paymentProviderCalled: false,
      },
    });
  });
});
