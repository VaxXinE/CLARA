import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { loadEnv } from "../src/config/env";
import { createAppServiceContainer } from "../src/app/service-container";
import { ResponseTimeSlaMetricsService } from "../src/analytics/response-time-sla-metrics-service";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P9 response time SLA metrics service", () => {
  it("returns deterministic aggregate SLA metrics without message bodies", async () => {
    const container = createAppServiceContainer(
      loadEnv({ NODE_ENV: "test", LOG_LEVEL: "silent" }),
    );
    const service = new ResponseTimeSlaMetricsService(
      container.services.conversations,
      () => new Date("2026-07-07T10:00:00.000Z"),
    );

    const response = await service.getMetrics({
      auth,
      query: { timeWindow: "last_7_days", channel: "all" },
    });

    expect(response.metrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metricKey: "first_response_time_avg",
          value: 180000,
        }),
        expect.objectContaining({
          metricKey: "first_response_time_p50",
          value: 120000,
        }),
        expect.objectContaining({
          metricKey: "first_response_time_p95",
          value: 240000,
        }),
        expect.objectContaining({
          metricKey: "unanswered_conversation_count",
          value: 0,
        }),
      ]),
    );
    expect(JSON.stringify(response)).not.toContain("Halo");
  });
});
