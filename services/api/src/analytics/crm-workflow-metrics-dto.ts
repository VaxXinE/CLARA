import {
  analyticsMetricContracts,
  analyticsPolicyVersion,
  type AnalyticsMetricKey,
} from "./analytics-metric-types";
import type {
  CrmWorkflowMetric,
  CrmWorkflowMetricsQuery,
  CrmWorkflowMetricsResponse,
} from "./crm-workflow-metrics-types";

const safety: CrmWorkflowMetricsResponse["safety"] = {
  readOnly: true,
  mutationAllowed: false,
  actionExecuted: false,
  crmMutationExecuted: false,
  taskCreated: false,
  customerNoteWritten: false,
  ownerAssigned: false,
  lifecycleStatusUpdated: false,
  outboundSent: false,
  customerLevelDrilldown: false,
  reportExported: false,
};

export function buildCrmWorkflowMetric(
  metricKey: AnalyticsMetricKey,
  value: number | string,
): CrmWorkflowMetric {
  const contract = analyticsMetricContracts[metricKey];

  return {
    metricKey,
    label: contract.label,
    description: contract.description,
    value,
    valueType: contract.valueType,
    aggregationLevel: "workspace",
    implementationStatus: "implemented",
    privacy: {
      aggregated: true,
      rawPayloadIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
      rawAuditMetadataIncluded: false,
      workspaceScoped: true,
      piiMinimized: true,
      policyVersion: analyticsPolicyVersion,
    },
  };
}

export function buildCrmWorkflowMetricsResponse(input: {
  workspaceId: string;
  generatedAt: string;
  query: CrmWorkflowMetricsQuery;
  metrics: CrmWorkflowMetric[];
}): CrmWorkflowMetricsResponse {
  return {
    workspaceId: input.workspaceId,
    generatedAt: input.generatedAt,
    timeWindow: input.query.timeWindow,
    category: input.query.category ?? "crm_workflow",
    metrics: input.query.category
      ? input.metrics.filter(
          (metric) =>
            analyticsMetricContracts[metric.metricKey].category ===
            input.query.category,
        )
      : input.metrics,
    safety,
  };
}

export function getCrmWorkflowMetricsSafety() {
  return safety;
}
