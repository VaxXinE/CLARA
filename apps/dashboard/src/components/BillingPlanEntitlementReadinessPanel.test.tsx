import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BillingPlanEntitlementReadinessResponse } from "../api/types";
import { BillingPlanEntitlementReadinessPanel } from "./BillingPlanEntitlementReadinessPanel";

const readiness: BillingPlanEntitlementReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-21T00:00:00.000Z",
  phase: "p11",
  billingReadiness: {
    billingPolicyDefined: true,
    paymentProviderBoundaryDefined: true,
    invoiceBoundaryDefined: true,
    subscriptionBoundaryDefined: true,
    chargingImplemented: false,
    invoiceCreationImplemented: false,
    paymentProviderIntegrated: false,
    paymentMethodStorageImplemented: false,
  },
  planCatalogReadiness: {
    planCatalogPolicyDefined: true,
    planComparisonDefined: true,
    planMutationImplemented: false,
    upgradeImplemented: false,
    downgradeImplemented: false,
    cancellationImplemented: false,
  },
  entitlementReadiness: {
    entitlementPolicyDefined: true,
    featureGatePolicyDefined: true,
    quotaLinkageDefined: true,
    entitlementMutationImplemented: false,
    productionQuotaBlockingImplemented: false,
    hardEnforcementImplemented: false,
  },
  subscriptionLifecycleBoundary: {
    lifecyclePolicyDefined: true,
    checkoutImplemented: false,
    renewalImplemented: false,
    cancellationImplemented: false,
    prorationImplemented: false,
    taxLogicImplemented: false,
  },
  safeBillingSummary: {
    aggregateOnly: true,
    workspaceScoped: true,
    rawUsageEventsIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    paymentDataIncluded: false,
    secretsIncluded: false,
  },
  controls: [
    {
      controlKey: "billing_boundary",
      label: "Billing Readiness",
      description: "Billing is readiness only.",
      status: "planned",
      severity: "warning",
      evidenceType: "policy",
    },
  ],
  safety: {
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
  },
};

describe("BillingPlanEntitlementReadinessPanel", () => {
  it("renders billing, plan, entitlement, and subscription readiness", () => {
    render(<BillingPlanEntitlementReadinessPanel readiness={readiness} />);

    expect(
      screen.getByRole("region", {
        name: "Billing Plan Entitlement Readiness",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Billing / Plan / Entitlement"),
    ).toBeInTheDocument();
    expect(screen.getByText("Billing Readiness")).toBeInTheDocument();
    expect(
      screen.getByText(/Readiness, not billing launch/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render token, secret, raw payload, or billing action values", () => {
    const { container } = render(
      <BillingPlanEntitlementReadinessPanel readiness={readiness} />,
    );
    const text = container.textContent ?? "";

    expect(text).not.toContain("access_token");
    expect(text).not.toContain("refresh_token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("client_secret");
    expect(text).not.toContain("raw provider payload");
    expect(text).not.toContain("payment method");
  });
});
