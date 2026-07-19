import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { CrmWorkflowMetricsService } from "../src/analytics/crm-workflow-metrics-service";

const auth = buildAuthContext({
  userId: "usr_demo_owner",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "owner",
  authMethod: "mock",
});

describe("P9 CRM workflow metrics service", () => {
  it("returns deterministic aggregate-only CRM workflow metrics", async () => {
    const service = new CrmWorkflowMetricsService(
      () => new Date("2026-07-20T01:00:00.000Z"),
    );

    const result = await service.getMetrics({
      auth,
      query: { timeWindow: "last_7_days" },
    });

    expect(result).toMatchObject({
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-20T01:00:00.000Z",
      timeWindow: "last_7_days",
      category: "crm_workflow",
      safety: {
        readOnly: true,
        mutationAllowed: false,
        crmMutationExecuted: false,
        taskCreated: false,
        outboundSent: false,
      },
    });
    expect(result.metrics.map((metric) => metric.metricKey)).toEqual([
      "crm_profile_intelligence_view_count",
      "crm_timeline_intelligence_view_count",
      "crm_action_proposal_review_count",
      "crm_follow_up_proposal_review_count",
      "crm_owner_assignment_readiness_view_count",
      "crm_lifecycle_status_readiness_view_count",
      "crm_audit_coverage_count",
      "blocked_crm_action_count",
      "crm_readiness_surface_count",
      "crm_review_only_action_count",
    ]);
    expect(result.metrics.at(0)?.privacy).toMatchObject({
      aggregated: true,
      rawPayloadIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
      rawAuditMetadataIncluded: false,
      workspaceScoped: true,
    });
  });

  it("filters by allowed CRM workflow category", async () => {
    const service = new CrmWorkflowMetricsService();
    const result = await service.getMetrics({
      auth,
      query: { timeWindow: "last_7_days", category: "audit_compliance" },
    });

    expect(result.metrics.map((metric) => metric.metricKey)).toEqual([
      "crm_audit_coverage_count",
      "blocked_crm_action_count",
    ]);
  });
});
