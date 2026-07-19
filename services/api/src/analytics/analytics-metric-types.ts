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
  conversation_total: {
    category: "operational",
    label: "Total conversations",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Total workspace conversations in the selected time window.",
  },
  conversation_open: {
    category: "operational",
    label: "Open conversations",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Open workspace conversations in the selected time window.",
  },
  conversation_closed: {
    category: "operational",
    label: "Closed conversations",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Closed workspace conversations in the selected time window.",
  },
  conversation_unresolved: {
    category: "operational",
    label: "Unresolved conversations",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Unresolved workspace conversations.",
  },
  conversation_by_channel: {
    category: "channel_performance",
    label: "Conversations by channel",
    valueType: "count",
    aggregationLevel: "channel",
    description: "Conversation volume grouped by channel.",
  },
  conversation_needs_attention: {
    category: "operational",
    label: "Needs attention conversations",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Open or pending conversations that need operator attention.",
  },
  first_response_time_avg: {
    category: "sla_readiness",
    label: "Average first response time",
    valueType: "duration_ms",
    aggregationLevel: "workspace",
    description: "Average time to first human response.",
  },
  first_response_time_p50: {
    category: "sla_readiness",
    label: "Median first response time",
    valueType: "duration_ms",
    aggregationLevel: "workspace",
    description: "Median time to first human response.",
  },
  first_response_time_p95: {
    category: "sla_readiness",
    label: "P95 first response time",
    valueType: "duration_ms",
    aggregationLevel: "workspace",
    description: "95th percentile time to first human response.",
  },
  last_response_age: {
    category: "sla_readiness",
    label: "Last response age",
    valueType: "duration_ms",
    aggregationLevel: "workspace",
    description: "Age of the oldest unresolved conversation response gap.",
  },
  sla_risk_count: {
    category: "sla_readiness",
    label: "SLA risk count",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Conversations at risk of missing SLA expectations.",
  },
  unanswered_conversation_count: {
    category: "sla_readiness",
    label: "Unanswered conversations",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Conversations with inbound messages and no outbound reply.",
  },
  channel_connected_count: {
    category: "channel_performance",
    label: "Connected channels",
    valueType: "count",
    aggregationLevel: "channel",
    description: "Connected provider/channel accounts.",
  },
  channel_degraded_count: {
    category: "channel_performance",
    label: "Degraded channels",
    valueType: "count",
    aggregationLevel: "channel",
    description: "Provider/channel accounts reporting degraded status.",
  },
  channel_disabled_count: {
    category: "channel_performance",
    label: "Disabled channels",
    valueType: "count",
    aggregationLevel: "channel",
    description: "Provider/channel accounts that are disabled or unavailable.",
  },
  inbound_sync_success_count: {
    category: "channel_performance",
    label: "Inbound sync successes",
    valueType: "count",
    aggregationLevel: "channel",
    description: "Successful inbound sync runs.",
  },
  inbound_sync_failure_count: {
    category: "channel_performance",
    label: "Inbound sync failures",
    valueType: "count",
    aggregationLevel: "channel",
    description: "Failed inbound sync runs.",
  },
  outbound_delivery_success_rate: {
    category: "channel_performance",
    label: "Outbound delivery success rate",
    valueType: "percentage",
    aggregationLevel: "channel",
    description: "Successful outbound deliveries divided by attempts.",
  },
  outbound_delivery_failure_count: {
    category: "channel_performance",
    label: "Outbound delivery failures",
    valueType: "count",
    aggregationLevel: "channel",
    description: "Failed outbound delivery attempts.",
  },
  provider_health_status: {
    category: "channel_performance",
    label: "Provider health status",
    valueType: "status",
    aggregationLevel: "channel",
    description: "Overall safe provider health status for the workspace.",
  },
  crm_profile_intelligence_view_count: {
    category: "crm_workflow",
    label: "Profile intelligence views",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Read-only customer profile intelligence views.",
  },
  crm_timeline_intelligence_view_count: {
    category: "crm_workflow",
    label: "Timeline intelligence views",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Read-only customer timeline intelligence views.",
  },
  crm_action_proposal_review_count: {
    category: "crm_workflow",
    label: "Action proposal reviews",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Review-only CRM action proposal views.",
  },
  crm_follow_up_proposal_review_count: {
    category: "crm_workflow",
    label: "Follow-up proposal reviews",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Review-only follow-up proposal views.",
  },
  crm_owner_assignment_readiness_view_count: {
    category: "crm_workflow",
    label: "Owner assignment readiness views",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Read-only owner assignment readiness views.",
  },
  crm_lifecycle_status_readiness_view_count: {
    category: "crm_workflow",
    label: "Lifecycle status readiness views",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Read-only lifecycle/status readiness views.",
  },
  crm_audit_coverage_count: {
    category: "audit_compliance",
    label: "CRM audit coverage count",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Audit-covered CRM intelligence/readiness events.",
  },
  blocked_crm_action_count: {
    category: "audit_compliance",
    label: "Blocked CRM actions",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "CRM actions blocked by review-only policy.",
  },
  crm_readiness_surface_count: {
    category: "crm_workflow",
    label: "CRM readiness surfaces",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "Read-only CRM readiness surfaces available to operators.",
  },
  crm_review_only_action_count: {
    category: "crm_workflow",
    label: "Review-only CRM actions",
    valueType: "count",
    aggregationLevel: "workspace",
    description: "CRM workflow actions kept in review-only mode.",
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
    rawCustomerMessagesIncluded: false;
    piiMinimized: true;
    workspaceScoped: true;
    policyVersion: typeof analyticsPolicyVersion;
  };
};
