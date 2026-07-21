import type { EntitlementReadiness } from "./entitlement-readiness-types";

export function getEntitlementReadinessPolicy(): EntitlementReadiness {
  return {
    entitlementPolicyDefined: true,
    featureGatePolicyDefined: true,
    quotaLinkageDefined: true,
    entitlementMutationImplemented: false,
    productionQuotaBlockingImplemented: false,
    hardEnforcementImplemented: false,
  };
}
