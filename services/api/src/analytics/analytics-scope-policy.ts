import type { AnalyticsMetricKey } from "./analytics-metric-types";
import { isAllowedAnalyticsMetricKey } from "./analytics-kpi-policy";
import { containsUnsafeAnalyticsRequest } from "./analytics-privacy-policy";

export const analyticsScopePolicyVersion = "p9-analytics-scope-policy-v1";

export const analyticsScopeAreas = [
  "conversation_volume_metrics",
  "reply_volume_metrics",
  "response_time_metrics",
  "channel_health_metrics",
  "follow_up_proposal_metrics",
  "crm_readiness_metrics",
  "audit_coverage_metrics",
  "operator_workload_metrics",
  "unresolved_conversation_metrics",
  "sla_readiness_metrics",
] as const;

export const analyticsNonGoals = [
  "heavy_dashboard",
  "scheduled_aggregation_job",
  "report_export",
  "crm_mutation",
  "task_creation",
  "customer_note_write",
  "owner_assignment",
  "lifecycle_status_update",
  "outbound_message_send",
  "real_ai_provider_call",
] as const;

export type AnalyticsScopeDecision =
  | { allowed: true; metricKey: AnalyticsMetricKey; workspaceId: string }
  | { allowed: false; reasonCode: string };

export function evaluateAnalyticsMetricRequest(input: {
  metricKey: string;
  authWorkspaceId: string;
  clientWorkspaceId?: string | null;
  payload?: unknown;
}): AnalyticsScopeDecision {
  if (!isAllowedAnalyticsMetricKey(input.metricKey)) {
    return { allowed: false, reasonCode: "unknown_metric_key" };
  }

  if (
    input.clientWorkspaceId &&
    input.clientWorkspaceId !== input.authWorkspaceId
  ) {
    return { allowed: false, reasonCode: "cross_workspace_blocked" };
  }

  if (containsUnsafeAnalyticsRequest(input.payload)) {
    return { allowed: false, reasonCode: "unsafe_metric_request" };
  }

  return {
    allowed: true,
    metricKey: input.metricKey,
    workspaceId: input.authWorkspaceId,
  };
}
