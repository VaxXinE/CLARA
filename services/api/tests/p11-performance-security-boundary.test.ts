import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { PerformanceCapacityReadinessService } from "../src/reliability/performance-readiness-service";

describe("P11 performance security boundary", () => {
  it("returns safe output without raw telemetry, payloads, tokens, cookies, or secrets", () => {
    const readiness = new PerformanceCapacityReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
    });
    const serialized = JSON.stringify(readiness);

    expect(readiness.safeBenchmarkSummary).toMatchObject({
      aggregateOnly: true,
      workspaceScoped: true,
      rawLogsIncluded: false,
      rawTracesIncluded: false,
      rawMetricEventsIncluded: false,
      secretsIncluded: false,
    });
    expect(serialized).not.toContain("Bearer ");
    expect(serialized).not.toContain("client_secret");
    expect(serialized).not.toContain("sessionCookie");
    expect(serialized).not.toContain("raw_request_body");
  });
});
