export type QuotaReadiness = {
  quotaPolicyDefined: true;
  softLimitPolicyDefined: true;
  hardLimitPolicyDefined: true;
  gracePeriodPolicyDefined: true;
  quotaEnforcementImplemented: false;
  entitlementMutationImplemented: false;
  planMutationImplemented: false;
};
