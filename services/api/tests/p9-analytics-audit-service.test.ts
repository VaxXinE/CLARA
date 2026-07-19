import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { AnalyticsAuditService } from "../src/analytics/analytics-audit-service";

describe("P9 analytics audit service", () => {
  it("creates deterministic safe analytics audit events", () => {
    const service = new AnalyticsAuditService(
      () => new Date("2026-07-20T02:00:00.000Z"),
    );
    const event = service.record({
      eventName: "p9_reporting_filter_applied",
      auth: buildAuthContext({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
      filters: {
        timeWindow: "last_7_days",
        channel: "email",
        operatorId: "usr_demo_agent",
      },
    });

    expect(event).toEqual({
      eventName: "p9_reporting_filter_applied",
      workspaceId: "wks_demo_sales",
      actorId: "usr_demo_owner",
      timestamp: "2026-07-20T02:00:00.000Z",
      safeFilterSummary: {
        timeWindow: "last_7_days",
        channel: "email",
        category: "all",
        operatorScoped: true,
      },
      reasonCode: "ok",
    });
    expect(JSON.stringify(event)).not.toContain("provider_payload");
  });
});
