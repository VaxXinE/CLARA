import type { AuthContext } from "../auth/auth-context";
import { getAnalyticsWorkspaceScope } from "./analytics-read-model-policy";
import { assertSafeCrmWorkflowMetricsQuery } from "./crm-workflow-metrics-policy";
import {
  buildCrmWorkflowMetric,
  buildCrmWorkflowMetricsResponse,
} from "./crm-workflow-metrics-dto";
import type {
  CrmWorkflowMetricsQuery,
  CrmWorkflowMetricsResponse,
} from "./crm-workflow-metrics-types";

export class CrmWorkflowMetricsService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  async getMetrics(input: {
    auth: AuthContext;
    query: CrmWorkflowMetricsQuery;
  }): Promise<CrmWorkflowMetricsResponse> {
    const scope = getAnalyticsWorkspaceScope(input.auth);
    assertSafeCrmWorkflowMetricsQuery({
      query: input.query,
      authWorkspaceId: scope.workspaceId,
    });

    return buildCrmWorkflowMetricsResponse({
      workspaceId: scope.workspaceId,
      generatedAt: this.now().toISOString(),
      query: input.query,
      metrics: [
        buildCrmWorkflowMetric("crm_profile_intelligence_view_count", 1),
        buildCrmWorkflowMetric("crm_timeline_intelligence_view_count", 1),
        buildCrmWorkflowMetric("crm_action_proposal_review_count", 1),
        buildCrmWorkflowMetric("crm_follow_up_proposal_review_count", 1),
        buildCrmWorkflowMetric("crm_owner_assignment_readiness_view_count", 1),
        buildCrmWorkflowMetric("crm_lifecycle_status_readiness_view_count", 1),
        buildCrmWorkflowMetric("crm_audit_coverage_count", 6),
        buildCrmWorkflowMetric("blocked_crm_action_count", 6),
        buildCrmWorkflowMetric("crm_readiness_surface_count", 2),
        buildCrmWorkflowMetric("crm_review_only_action_count", 2),
      ],
    });
  }
}
