import type {
  AnalyticsAggregationLevel,
  AnalyticsMetricCategory,
  AnalyticsMetricKey,
  AnalyticsTimeWindow,
  AnalyticsValueType,
} from "./analytics-metric-types";

export type CrmWorkflowTimeWindow = Exclude<AnalyticsTimeWindow, "custom">;

export type CrmWorkflowCategory = "crm_workflow" | "audit_compliance";

export type CrmWorkflowMetricsQuery = {
  timeWindow: CrmWorkflowTimeWindow;
  category?: CrmWorkflowCategory;
  workspaceId?: string;
};

export type CrmWorkflowMetric = {
  metricKey: AnalyticsMetricKey;
  label: string;
  description: string;
  value: number | string;
  valueType: AnalyticsValueType;
  aggregationLevel: Extract<AnalyticsAggregationLevel, "workspace">;
  implementationStatus: "implemented";
  privacy: {
    aggregated: true;
    rawPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
    rawProviderPayloadIncluded: false;
    rawWebhookPayloadIncluded: false;
    rawAuditMetadataIncluded: false;
    workspaceScoped: true;
    piiMinimized: true;
    policyVersion: string;
  };
};

export type CrmWorkflowMetricsResponse = {
  workspaceId: string;
  generatedAt: string;
  timeWindow: CrmWorkflowTimeWindow;
  category: AnalyticsMetricCategory;
  metrics: CrmWorkflowMetric[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    actionExecuted: false;
    crmMutationExecuted: false;
    taskCreated: false;
    customerNoteWritten: false;
    ownerAssigned: false;
    lifecycleStatusUpdated: false;
    outboundSent: false;
    customerLevelDrilldown: false;
    reportExported: false;
  };
};
