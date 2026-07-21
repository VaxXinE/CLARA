import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { BillingPlanEntitlementReadinessService } from "../src/billing/billing-readiness-service";

describe("P11 billing security boundary", () => {
  it("returns safe workspace-scoped output without billing secrets or raw payloads", () => {
    const readiness = new BillingPlanEntitlementReadinessService().getReadiness(
      {
        auth: buildAuthContext({
          userId: "usr_demo_viewer",
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          role: "viewer",
        }),
      },
    );
    const serialized = JSON.stringify(readiness);

    expect(readiness.safeBillingSummary).toMatchObject({
      aggregateOnly: true,
      workspaceScoped: true,
      rawUsageEventsIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
      paymentDataIncluded: false,
      secretsIncluded: false,
    });
    expect(serialized).not.toContain("Bearer ");
    expect(serialized).not.toContain("client_secret");
    expect(serialized).not.toContain("sessionCookie");
    expect(serialized).not.toContain("payment_method_id");
    expect(serialized).not.toContain("card_number");
  });
});
