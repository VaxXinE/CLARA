import {
  getBillingReadinessControls,
  getBillingReadinessPolicy,
} from "./billing-readiness-policy";
import { buildSafeBillingSummary } from "./billing-readiness-safe-summary";
import { getEntitlementReadinessPolicy } from "./entitlement-readiness-policy";
import { getPlanCatalogReadinessPolicy } from "./plan-catalog-readiness-policy";
import { getSubscriptionLifecycleBoundaryPolicy } from "./subscription-lifecycle-boundary-policy";
import type {
  BillingPlanEntitlementReadinessInput,
  BillingPlanEntitlementReadinessResponse,
} from "./billing-readiness-types";

export function toBillingPlanEntitlementReadinessDto(
  input: BillingPlanEntitlementReadinessInput,
): BillingPlanEntitlementReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: (input.generatedAt ?? new Date()).toISOString(),
    phase: "p11",
    billingReadiness: getBillingReadinessPolicy(),
    planCatalogReadiness: getPlanCatalogReadinessPolicy(),
    entitlementReadiness: getEntitlementReadinessPolicy(),
    subscriptionLifecycleBoundary: getSubscriptionLifecycleBoundaryPolicy(),
    safeBillingSummary: buildSafeBillingSummary(),
    controls: getBillingReadinessControls(),
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
}
