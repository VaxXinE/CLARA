import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { loadEnv } from "../src/config/env";
import { createAppServiceContainer } from "../src/app/service-container";
import { ChannelPerformanceMetricsService } from "../src/analytics/channel-performance-metrics-service";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P9 channel performance metrics service", () => {
  it("returns safe aggregate channel metrics from channel health", async () => {
    const container = createAppServiceContainer(
      loadEnv({ NODE_ENV: "test", LOG_LEVEL: "silent" }),
    );
    const service = new ChannelPerformanceMetricsService(
      container.services.channelHealth!,
      () => new Date("2026-07-07T10:00:00.000Z"),
    );

    const response = await service.getMetrics({
      auth,
      query: { timeWindow: "last_7_days", channel: "all" },
    });

    expect(response.metrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metricKey: "channel_connected_count",
          value: 3,
        }),
        expect.objectContaining({
          metricKey: "provider_health_status",
          value: "action_required",
        }),
      ]),
    );
    expect(JSON.stringify(response)).not.toContain("access_token");
  });
});
