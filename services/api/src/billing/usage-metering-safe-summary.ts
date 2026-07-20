import type { UsageMeteringSafeSummary } from "./usage-metering-readiness-types";

export function buildUsageMeteringSafeSummary(): UsageMeteringSafeSummary {
  return {
    aggregateOnly: true,
    workspaceScoped: true,
    rawUsageEventsIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    safeBillingMetadataOnly: true,
  };
}
