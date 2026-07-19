import {
  analyticsMetricContracts,
  analyticsPolicyVersion,
  type AnalyticsMetricKey,
} from "./analytics-metric-types";
import type {
  CoreOperationalMetric,
  CoreOperationalMetricsResponse,
  CoreOperationalMetricsQuery,
} from "./analytics-operational-metric-types";

const safety: CoreOperationalMetricsResponse["safety"] = {
  readOnly: true,
  mutationAllowed: false,
  actionExecuted: false,
  crmMutationExecuted: false,
  taskCreated: false,
  outboundSent: false,
  customerLevelDrilldown: false,
  reportExported: false,
};

export function buildCoreOperationalMetric(
  metricKey: AnalyticsMetricKey,
  value: number | string,
): CoreOperationalMetric {
  const contract = analyticsMetricContracts[metricKey];

  return {
    metricKey,
    label: contract.label,
    description: contract.description,
    value,
    valueType: contract.valueType,
    aggregationLevel:
      contract.aggregationLevel === "channel" ? "channel" : "workspace",
    implementationStatus: "implemented",
    privacy: {
      aggregated: true,
      rawPayloadIncluded: false,
      rawCustomerMessagesIncluded: false,
      workspaceScoped: true,
      piiMinimized: true,
      policyVersion: analyticsPolicyVersion,
    },
  };
}

export function buildCoreOperationalMetricsResponse(input: {
  workspaceId: string;
  generatedAt: string;
  query: CoreOperationalMetricsQuery;
  category: CoreOperationalMetricsResponse["category"];
  metrics: CoreOperationalMetric[];
}): CoreOperationalMetricsResponse {
  return {
    workspaceId: input.workspaceId,
    generatedAt: input.generatedAt,
    timeWindow: input.query.timeWindow,
    channel: input.query.channel,
    category: input.category,
    metrics: input.metrics,
    safety,
  };
}

export function getCoreOperationalMetricsSafety() {
  return safety;
}
