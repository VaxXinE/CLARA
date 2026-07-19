import { describe, expect, it } from "vitest";
import {
  analyticsNonGoals,
  analyticsScopeAreas,
  evaluateAnalyticsMetricRequest,
} from "../src/analytics/analytics-scope-policy";

describe("P9 analytics scope policy", () => {
  it("defines the P9 Analytics / Reporting / KPI metric scope", () => {
    expect(analyticsScopeAreas).toEqual([
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
    ]);
  });

  it("keeps P9-PR-01 policy-only and non-mutating", () => {
    expect(analyticsNonGoals).toContain("heavy_dashboard");
    expect(analyticsNonGoals).toContain("scheduled_aggregation_job");
    expect(analyticsNonGoals).toContain("report_export");
    expect(analyticsNonGoals).toContain("crm_mutation");
    expect(analyticsNonGoals).toContain("task_creation");
    expect(analyticsNonGoals).toContain("outbound_message_send");
    expect(analyticsNonGoals).toContain("real_ai_provider_call");
  });

  it("derives workspace scope from Backend AuthContext", () => {
    expect(
      evaluateAnalyticsMetricRequest({
        metricKey: "conversation_volume",
        authWorkspaceId: "wks_auth",
        clientWorkspaceId: "wks_other",
      }),
    ).toEqual({ allowed: false, reasonCode: "cross_workspace_blocked" });

    expect(
      evaluateAnalyticsMetricRequest({
        metricKey: "conversation_volume",
        authWorkspaceId: "wks_auth",
      }),
    ).toMatchObject({ allowed: true, workspaceId: "wks_auth" });
  });
});
