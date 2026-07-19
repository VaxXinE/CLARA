import type {
  AnalyticsMetricCategory,
  AnalyticsTimeWindow,
  AnalyticsValueType,
} from "./analytics-metric-types";

export type KpiDashboardTimeWindow = Exclude<AnalyticsTimeWindow, "custom">;

export type KpiDashboardCategory =
  | "crm_workflow"
  | "audit_compliance"
  | "operational"
  | "channel_performance"
  | "sla_readiness";

export type KpiDashboardCardKey =
  | "total_conversations"
  | "unresolved_conversations"
  | "sla_risk"
  | "channel_health"
  | "crm_workflow_reviews"
  | "crm_audit_coverage"
  | "blocked_sensitive_actions"
  | "outbound_delivery_health";

export type KpiDashboardQuery = {
  timeWindow: KpiDashboardTimeWindow;
  category?: KpiDashboardCategory;
  workspaceId?: string;
};

export type KpiDashboardCard = {
  cardKey: KpiDashboardCardKey;
  label: string;
  description: string;
  value: number | string;
  valueType: AnalyticsValueType;
  category: AnalyticsMetricCategory;
  severity: "neutral" | "good" | "warning" | "critical";
  source:
    | "core_operational_metrics"
    | "crm_workflow_metrics"
    | "channel_performance_metrics"
    | "sla_readiness_metrics";
  privacy: {
    aggregated: true;
    workspaceScoped: true;
    rawPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
    piiMinimized: true;
  };
};

export type KpiDashboardResponse = {
  workspaceId: string;
  generatedAt: string;
  timeWindow: KpiDashboardTimeWindow;
  cards: KpiDashboardCard[];
  safety: {
    readOnly: true;
    exportEnabled: false;
    drilldownEnabled: false;
    mutationAllowed: false;
  };
};
