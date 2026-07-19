import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { loadEnv } from "../src/config/env";
import { createAppServiceContainer } from "../src/app/service-container";
import { ChannelPerformanceMetricsService } from "../src/analytics/channel-performance-metrics-service";
import { ConversationVolumeMetricsService } from "../src/analytics/conversation-volume-metrics-service";
import { CrmWorkflowMetricsService } from "../src/analytics/crm-workflow-metrics-service";
import { KpiDashboardCardService } from "../src/analytics/kpi-dashboard-card-service";
import { ResponseTimeSlaMetricsService } from "../src/analytics/response-time-sla-metrics-service";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P9 KPI dashboard card service", () => {
  it("returns aggregate dashboard cards from existing P9 metrics", async () => {
    const container = createAppServiceContainer(
      loadEnv({ NODE_ENV: "test", LOG_LEVEL: "silent" }),
    );
    const conversationVolume = new ConversationVolumeMetricsService(
      container.services.conversations,
      () => new Date("2026-07-20T01:00:00.000Z"),
    );
    const responseTimeSla = new ResponseTimeSlaMetricsService(
      container.services.conversations,
      () => new Date("2026-07-20T01:00:00.000Z"),
    );
    const channelPerformance = new ChannelPerformanceMetricsService(
      container.services.channelHealth!,
      () => new Date("2026-07-20T01:00:00.000Z"),
    );
    const crmWorkflow = new CrmWorkflowMetricsService(
      () => new Date("2026-07-20T01:00:00.000Z"),
    );
    const service = new KpiDashboardCardService(
      conversationVolume,
      responseTimeSla,
      channelPerformance,
      crmWorkflow,
      () => new Date("2026-07-20T01:00:00.000Z"),
    );

    const result = await service.getDashboard({
      auth,
      query: { timeWindow: "last_7_days" },
    });

    expect(result).toMatchObject({
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-20T01:00:00.000Z",
      safety: {
        readOnly: true,
        exportEnabled: false,
        drilldownEnabled: false,
        mutationAllowed: false,
      },
    });
    expect(result.cards.map((card) => card.cardKey)).toEqual([
      "total_conversations",
      "unresolved_conversations",
      "sla_risk",
      "channel_health",
      "crm_workflow_reviews",
      "crm_audit_coverage",
      "blocked_sensitive_actions",
      "outbound_delivery_health",
    ]);
    expect(JSON.stringify(result)).not.toContain("access_token");
    expect(JSON.stringify(result)).not.toContain("refresh_token");
  });

  it("filters cards by allowed category", async () => {
    const container = createAppServiceContainer(
      loadEnv({ NODE_ENV: "test", LOG_LEVEL: "silent" }),
    );
    const service = new KpiDashboardCardService(
      new ConversationVolumeMetricsService(container.services.conversations),
      new ResponseTimeSlaMetricsService(container.services.conversations),
      new ChannelPerformanceMetricsService(container.services.channelHealth!),
      new CrmWorkflowMetricsService(),
    );

    const result = await service.getDashboard({
      auth,
      query: { timeWindow: "last_7_days", category: "audit_compliance" },
    });

    expect(result.cards.map((card) => card.cardKey)).toEqual([
      "crm_audit_coverage",
      "blocked_sensitive_actions",
    ]);
  });
});
