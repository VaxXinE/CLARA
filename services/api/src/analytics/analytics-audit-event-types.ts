export const analyticsAuditEventNames = [
  "p9_analytics_overview_viewed",
  "p9_conversation_metrics_viewed",
  "p9_response_time_sla_metrics_viewed",
  "p9_channel_performance_metrics_viewed",
  "p9_crm_workflow_metrics_viewed",
  "p9_kpi_dashboard_viewed",
  "p9_reporting_filter_applied",
  "p9_reporting_filter_rejected",
  "p9_analytics_policy_blocked",
  "p9_cross_workspace_analytics_blocked",
  "p9_sensitive_metric_request_redacted",
  "p9_operator_filter_denied",
] as const;

export type AnalyticsAuditEventName = (typeof analyticsAuditEventNames)[number];

export type AnalyticsAuditEvent = {
  eventName: AnalyticsAuditEventName;
  workspaceId: string;
  actorId: string;
  timestamp: string;
  safeFilterSummary: {
    timeWindow: string;
    channel: string;
    category: string;
    operatorScoped: boolean;
  };
  reasonCode: string;
};
