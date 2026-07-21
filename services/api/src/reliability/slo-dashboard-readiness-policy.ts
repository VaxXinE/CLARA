import type { SloDashboardReadiness } from "./slo-dashboard-readiness-types";

export function getSloDashboardReadinessPolicy(): SloDashboardReadiness {
  return {
    availabilitySloDefined: true,
    latencySloDefined: true,
    errorRateSloDefined: true,
    queueReliabilitySloDefined: true,
    webhookProcessingSloDefined: true,
    outboundDeliverySloDefined: true,
    errorBudgetPolicyDefined: true,
    productionSlaPromised: false,
  };
}
