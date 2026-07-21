export function buildPerformanceCapacitySafeSummary() {
  return {
    syntheticOnly: true,
    workspaceScoped: true,
    aggregateOnly: true,
    rawLogsIncluded: false,
    rawTracesIncluded: false,
    rawMetricEventsIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    secretsIncluded: false,
  } as const;
}
