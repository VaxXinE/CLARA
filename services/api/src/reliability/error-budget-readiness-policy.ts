export function getErrorBudgetReadinessPolicy() {
  return {
    errorBudgetPolicyDefined: true,
    burnRateReviewDefined: true,
    productionSlaPromised: false,
    automatedEnforcementImplemented: false,
  } as const;
}
