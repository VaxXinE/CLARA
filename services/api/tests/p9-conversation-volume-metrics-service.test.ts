import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { loadEnv } from "../src/config/env";
import { createAppServiceContainer } from "../src/app/service-container";
import { ConversationVolumeMetricsService } from "../src/analytics/conversation-volume-metrics-service";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P9 conversation volume metrics service", () => {
  it("returns aggregate-only workspace-scoped conversation volume metrics", async () => {
    const container = createAppServiceContainer(
      loadEnv({ NODE_ENV: "test", LOG_LEVEL: "silent" }),
    );
    const service = new ConversationVolumeMetricsService(
      container.services.conversations,
      () => new Date("2026-07-07T10:00:00.000Z"),
    );

    const response = await service.getMetrics({
      auth,
      query: { timeWindow: "last_7_days", channel: "all" },
    });

    expect(response).toMatchObject({
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-07T10:00:00.000Z",
      category: "operational",
      safety: {
        readOnly: true,
        mutationAllowed: false,
        outboundSent: false,
        customerLevelDrilldown: false,
        reportExported: false,
      },
    });
    expect(response.metrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ metricKey: "conversation_total", value: 2 }),
        expect.objectContaining({ metricKey: "conversation_open", value: 1 }),
        expect.objectContaining({
          metricKey: "conversation_needs_attention",
          value: 2,
        }),
      ]),
    );
    expect(JSON.stringify(response)).not.toContain("raw_customer_message");
  });
});
