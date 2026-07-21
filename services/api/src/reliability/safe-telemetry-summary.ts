export type SafeTelemetrySummary = {
  aggregateOnly: true;
  workspaceScoped: true;
  rawLogsIncluded: false;
  rawTracesIncluded: false;
  rawMetricEventsIncluded: false;
  rawCustomerMessagesIncluded: false;
  rawProviderPayloadIncluded: false;
  rawWebhookPayloadIncluded: false;
  secretsIncluded: false;
};

export function buildSafeTelemetrySummary(): SafeTelemetrySummary {
  return {
    aggregateOnly: true,
    workspaceScoped: true,
    rawLogsIncluded: false,
    rawTracesIncluded: false,
    rawMetricEventsIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    secretsIncluded: false,
  };
}
