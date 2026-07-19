import type { AuthContext } from "../auth/auth-context";
import { ChannelPerformanceMetricsService } from "./channel-performance-metrics-service";
import { ConversationVolumeMetricsService } from "./conversation-volume-metrics-service";
import { CrmWorkflowMetricsService } from "./crm-workflow-metrics-service";
import type { CoreOperationalMetric } from "./analytics-operational-metric-types";
import { getAnalyticsWorkspaceScope } from "./analytics-read-model-policy";
import { ResponseTimeSlaMetricsService } from "./response-time-sla-metrics-service";
import { assertSafeKpiDashboardQuery } from "./kpi-dashboard-card-policy";
import {
  buildKpiDashboardCard,
  buildKpiDashboardResponse,
} from "./kpi-dashboard-card-dto";
import type {
  KpiDashboardQuery,
  KpiDashboardResponse,
} from "./kpi-dashboard-card-types";

function metricValue(
  metrics: CoreOperationalMetric[],
  key: string,
): number | string {
  return metrics.find((metric) => metric.metricKey === key)?.value ?? 0;
}

function numberMetric(metrics: CoreOperationalMetric[], key: string): number {
  const value = metricValue(metrics, key);

  return typeof value === "number" ? value : Number(value) || 0;
}

export class KpiDashboardCardService {
  constructor(
    private readonly conversationVolume: ConversationVolumeMetricsService,
    private readonly responseTimeSla: ResponseTimeSlaMetricsService,
    private readonly channelPerformance: ChannelPerformanceMetricsService,
    private readonly crmWorkflow: CrmWorkflowMetricsService,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async getDashboard(input: {
    auth: AuthContext;
    query: KpiDashboardQuery;
  }): Promise<KpiDashboardResponse> {
    const scope = getAnalyticsWorkspaceScope(input.auth);
    assertSafeKpiDashboardQuery({
      query: input.query,
      authWorkspaceId: scope.workspaceId,
    });

    const query = {
      timeWindow: input.query.timeWindow,
      channel: "all",
    } as const;
    const [
      conversationVolume,
      responseTimeSla,
      channelPerformance,
      crmWorkflow,
    ] = await Promise.all([
      this.conversationVolume.getMetrics({ auth: input.auth, query }),
      this.responseTimeSla.getMetrics({ auth: input.auth, query }),
      this.channelPerformance.getMetrics({ auth: input.auth, query }),
      this.crmWorkflow.getMetrics({
        auth: input.auth,
        query: { timeWindow: input.query.timeWindow },
      }),
    ]);

    const outboundFailures = numberMetric(
      channelPerformance.metrics,
      "outbound_delivery_failure_count",
    );
    const actionReviews = numberMetric(
      crmWorkflow.metrics,
      "crm_action_proposal_review_count",
    );
    const followUpReviews = numberMetric(
      crmWorkflow.metrics,
      "crm_follow_up_proposal_review_count",
    );

    return buildKpiDashboardResponse({
      workspaceId: scope.workspaceId,
      generatedAt: this.now().toISOString(),
      query: input.query,
      cards: [
        buildKpiDashboardCard({
          cardKey: "total_conversations",
          value: numberMetric(conversationVolume.metrics, "conversation_total"),
          valueType: "count",
          severity: "neutral",
        }),
        buildKpiDashboardCard({
          cardKey: "unresolved_conversations",
          value: numberMetric(
            conversationVolume.metrics,
            "conversation_unresolved",
          ),
          valueType: "count",
          severity: "warning",
        }),
        buildKpiDashboardCard({
          cardKey: "sla_risk",
          value: numberMetric(responseTimeSla.metrics, "sla_risk_count"),
          valueType: "count",
          severity: "warning",
        }),
        buildKpiDashboardCard({
          cardKey: "channel_health",
          value: metricValue(
            channelPerformance.metrics,
            "provider_health_status",
          ),
          valueType: "status",
          severity: "good",
        }),
        buildKpiDashboardCard({
          cardKey: "crm_workflow_reviews",
          value: actionReviews + followUpReviews,
          valueType: "count",
          severity: "neutral",
        }),
        buildKpiDashboardCard({
          cardKey: "crm_audit_coverage",
          value: numberMetric(crmWorkflow.metrics, "crm_audit_coverage_count"),
          valueType: "count",
          severity: "good",
        }),
        buildKpiDashboardCard({
          cardKey: "blocked_sensitive_actions",
          value: numberMetric(crmWorkflow.metrics, "blocked_crm_action_count"),
          valueType: "count",
          severity: "good",
        }),
        buildKpiDashboardCard({
          cardKey: "outbound_delivery_health",
          value: outboundFailures > 0 ? "attention" : "healthy",
          valueType: "status",
          severity: outboundFailures > 0 ? "warning" : "good",
        }),
      ],
    });
  }
}
