import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RateLimitQuotaUsageReadinessResponse } from "../api/types";
import { RateLimitQuotaUsageReadinessPanel } from "./RateLimitQuotaUsageReadinessPanel";

const readiness: RateLimitQuotaUsageReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p11",
  rateLimitReadiness: {
    policyDefined: true,
    perWorkspaceLimitDefined: true,
    perUserLimitDefined: true,
    perEndpointLimitDefined: true,
    burstLimitPolicyDefined: true,
    safe429BehaviorDefined: true,
    productionQuotaBlockingImplemented: false,
    destructiveThrottleImplemented: false,
  },
  quotaReadiness: {
    quotaPolicyDefined: true,
    softLimitPolicyDefined: true,
    hardLimitPolicyDefined: true,
    gracePeriodPolicyDefined: true,
    quotaEnforcementImplemented: false,
    entitlementMutationImplemented: false,
    planMutationImplemented: false,
  },
  usageMeteringReadiness: {
    aggregateUsageDefined: true,
    workspaceScopedUsageDefined: true,
    billingSafeMetadataDefined: true,
    rawUsageEventsExposed: false,
    customerLevelDrilldownImplemented: false,
    invoiceCreationImplemented: false,
    chargingImplemented: false,
  },
  controls: [
    {
      controlKey: "rate_limit_readiness",
      label: "Rate Limit readiness",
      description: "Rate limit policy is defined.",
      status: "ready",
      severity: "warning",
      evidenceType: "policy",
    },
  ],
  usageSummary: {
    aggregateOnly: true,
    workspaceScoped: true,
    rawUsageEventsIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    safeBillingMetadataOnly: true,
  },
  billingMetadataBoundary: {
    providerNamesAllowed: true,
    planCodeAllowed: true,
    workspaceIdAllowed: true,
    aggregateCountersAllowed: true,
    rawUsageEventsAllowed: false,
    rawCustomerMessagesAllowed: false,
    rawProviderPayloadAllowed: false,
    rawWebhookPayloadAllowed: false,
    paymentCredentialsAllowed: false,
  },
  safety: {
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
  },
};

describe("RateLimitQuotaUsageReadinessPanel", () => {
  it("renders readiness without billing or quota mutation controls", () => {
    render(<RateLimitQuotaUsageReadinessPanel readiness={readiness} />);

    expect(
      screen.getByRole("region", {
        name: "Rate Limit Quota Usage Readiness",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Rate Limit / Quota / Usage")).toBeInTheDocument();
    expect(screen.getByText("Rate Limit readiness")).toBeInTheDocument();
    expect(screen.getByText(/no quota enforcement/i)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render token, secret, or raw payload values", () => {
    const { container } = render(
      <RateLimitQuotaUsageReadinessPanel readiness={readiness} />,
    );

    expect(container.textContent).not.toContain("access token");
    expect(container.textContent).not.toContain("refresh token");
    expect(container.textContent).not.toContain("Authorization");
    expect(container.textContent).not.toContain("raw provider payload");
    expect(container.textContent).not.toContain("client secret");
  });
});
