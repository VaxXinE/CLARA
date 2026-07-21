import type { SafeBillingSummary } from "./billing-readiness-types";

export function buildSafeBillingSummary(): SafeBillingSummary {
  return {
    aggregateOnly: true,
    workspaceScoped: true,
    rawUsageEventsIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    paymentDataIncluded: false,
    secretsIncluded: false,
  };
}
