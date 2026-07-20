import type { BillingSafeMetadataBoundary } from "./usage-metering-readiness-types";

export function buildBillingSafeMetadataBoundary(): BillingSafeMetadataBoundary {
  return {
    providerNamesAllowed: true,
    planCodeAllowed: true,
    workspaceIdAllowed: true,
    aggregateCountersAllowed: true,
    rawUsageEventsAllowed: false,
    rawCustomerMessagesAllowed: false,
    rawProviderPayloadAllowed: false,
    rawWebhookPayloadAllowed: false,
    paymentCredentialsAllowed: false,
  };
}
