import type {
  AnalyticsAggregationLevel,
  AnalyticsMetricCategory,
  AnalyticsMetricKey,
  AnalyticsValueType,
} from "./analytics-metric-types";

export type AnalyticsReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p9";
  readiness: {
    analyticsFoundationReady: boolean;
    metricRegistryReady: boolean;
    metricContractReady: boolean;
    runtimeMetricsImplemented: false;
    scheduledAggregationImplemented: false;
    reportExportImplemented: false;
  };
  allowedCategories: AnalyticsMetricCategory[];
  blockedCategories: string[];
  privacy: {
    workspaceScoped: true;
    aggregateFirst: true;
    rawPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
    piiMinimized: true;
    policyVersion: string;
  };
  safety: {
    readOnly: true;
    mutationAllowed: false;
    actionExecuted: false;
    crmMutationExecuted: false;
    taskCreated: false;
    outboundSent: false;
  };
};

export type AnalyticsMetricCatalogItem = {
  metricKey: AnalyticsMetricKey;
  category: AnalyticsMetricCategory;
  label: string;
  description: string;
  valueType: AnalyticsValueType;
  aggregationLevel: AnalyticsAggregationLevel;
  implementationStatus:
    "policy_defined" | "foundation_ready" | "not_implemented_yet";
  privacy: {
    aggregated: true;
    rawPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
    workspaceScoped: true;
    piiMinimized: true;
  };
};

export type AnalyticsMetricCatalogResponse = {
  workspaceId: string;
  generatedAt: string;
  categories: AnalyticsMetricCategory[];
  metrics: AnalyticsMetricCatalogItem[];
};
