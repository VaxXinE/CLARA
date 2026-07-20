import type { QuotaReadiness } from "./quota-readiness-types";

export function getQuotaReadinessPolicy(): QuotaReadiness {
  return {
    quotaPolicyDefined: true,
    softLimitPolicyDefined: true,
    hardLimitPolicyDefined: true,
    gracePeriodPolicyDefined: true,
    quotaEnforcementImplemented: false,
    entitlementMutationImplemented: false,
    planMutationImplemented: false,
  };
}
