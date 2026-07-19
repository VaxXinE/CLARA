export const analyticsPolicyVersion = "p9-analytics-kpi-policy-v1";

export const analyticsMetricCategories = [
  "operational",
  "customer_engagement",
  "channel_performance",
  "crm_workflow",
  "audit_compliance",
  "operator_productivity",
  "sla_readiness",
] as const;

export const analyticsValueTypes = [
  "count",
  "percentage",
  "duration_ms",
  "ratio",
  "status",
] as const;

export const analyticsAggregationLevels = [
  "workspace",
  "channel",
  "operator",
  "customer_segment",
] as const;

export const analyticsTimeWindows = [
  "today",
  "last_7_days",
  "last_30_days",
  "custom",
] as const;

export const analyticsMetricContracts = {
  conversation_volume: {
    category: "operational",
    label: "Conversation volume",
    valueType: "count",
    aggregationLevel: "workspace",
  },
  reply_volume: {
    category: "customer_engagement",
    label: "Reply volume",
    valueType: "count",
    aggregationLevel: "workspace",
  },
  average_response_time_ms: {
    category: "sla_readiness",
    label: "Average response time",
    valueType: "duration_ms",
    aggregationLevel: "workspace",
  },
  channel_health_status: {
    category: "channel_performance",
    label: "Channel health",
    valueType: "status",
    aggregationLevel: "channel",
  },
  follow_up_proposal_count: {
    category: "crm_workflow",
    label: "Follow-up proposals",
    valueType: "count",
    aggregationLevel: "workspace",
  },
  crm_readiness_coverage: {
    category: "crm_workflow",
    label: "CRM readiness coverage",
    valueType: "percentage",
    aggregationLevel: "workspace",
  },
  audit_coverage_rate: {
    category: "audit_compliance",
    label: "Audit coverage",
    valueType: "percentage",
    aggregationLevel: "workspace",
  },
  operator_workload_count: {
    category: "operator_productivity",
    label: "Operator workload",
    valueType: "count",
    aggregationLevel: "operator",
  },
  unresolved_conversation_count: {
    category: "operational",
    label: "Unresolved conversations",
    valueType: "count",
    aggregationLevel: "workspace",
  },
  sla_readiness_status: {
    category: "sla_readiness",
    label: "SLA readiness",
    valueType: "status",
    aggregationLevel: "workspace",
  },
} as const;

export type AnalyticsMetricCategory =
  (typeof analyticsMetricCategories)[number];
export type AnalyticsValueType = (typeof analyticsValueTypes)[number];
export type AnalyticsAggregationLevel =
  (typeof analyticsAggregationLevels)[number];
export type AnalyticsTimeWindow = (typeof analyticsTimeWindows)[number];
export type AnalyticsMetricKey = keyof typeof analyticsMetricContracts;

export type AnalyticsMetricOutput = {
  metricKey: AnalyticsMetricKey;
  workspaceId: string;
  generatedAt: string;
  category: AnalyticsMetricCategory;
  label: string;
  description: string;
  valueType: AnalyticsValueType;
  aggregationLevel: AnalyticsAggregationLevel;
  timeWindow: AnalyticsTimeWindow;
  privacy: {
    aggregated: true;
    rawPayloadIncluded: false;
    piiMinimized: true;
    workspaceScoped: true;
    policyVersion: typeof analyticsPolicyVersion;
  };
};
