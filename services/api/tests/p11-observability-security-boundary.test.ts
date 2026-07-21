import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { ObservabilitySloAlertReadinessService } from "../src/reliability/observability-readiness-service";

describe("P11 observability security boundary", () => {
  it("returns safe aggregate output without telemetry payloads or secrets", () => {
    const readiness = new ObservabilitySloAlertReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
    });
    const serialized = JSON.stringify(readiness);

    expect(readiness.safeTelemetrySummary).toMatchObject({
      aggregateOnly: true,
      rawLogsIncluded: false,
      rawTracesIncluded: false,
      rawMetricEventsIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
      secretsIncluded: false,
    });
    expect(serialized).not.toContain("Bearer ");
    expect(serialized).not.toContain("client_secret");
    expect(serialized).not.toContain("sessionCookie");
    expect(serialized).not.toContain("raw audit metadata");
  });
});
