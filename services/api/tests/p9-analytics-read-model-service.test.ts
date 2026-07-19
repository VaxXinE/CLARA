import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { AnalyticsReadModelService } from "../src/analytics/analytics-read-model-service";

const auth = buildAuthContext({
  userId: "usr_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P9 analytics read model service", () => {
  it("returns safe analytics foundation readiness", () => {
    const response = new AnalyticsReadModelService().getReadiness({ auth });

    expect(response).toMatchObject({
      workspaceId: "wks_demo_sales",
      phase: "p9",
      readiness: {
        analyticsFoundationReady: true,
        metricRegistryReady: true,
        metricContractReady: true,
        runtimeMetricsImplemented: false,
        scheduledAggregationImplemented: false,
        reportExportImplemented: false,
      },
      privacy: {
        workspaceScoped: true,
        aggregateFirst: true,
        rawPayloadIncluded: false,
        rawCustomerMessagesIncluded: false,
      },
      safety: {
        readOnly: true,
        mutationAllowed: false,
        actionExecuted: false,
        crmMutationExecuted: false,
        taskCreated: false,
        outboundSent: false,
      },
    });
  });

  it("returns workspace-scoped metric catalog without runtime values", () => {
    const response = new AnalyticsReadModelService().getMetricCatalog({
      auth,
      query: { category: "crm_workflow" },
    });

    expect(response.workspaceId).toBe("wks_demo_sales");
    expect(response.metrics.length).toBeGreaterThan(0);
    expect(
      response.metrics.every((metric) => metric.category === "crm_workflow"),
    ).toBe(true);
    expect(response.metrics[0]).toMatchObject({
      implementationStatus: "foundation_ready",
      privacy: {
        aggregated: true,
        rawPayloadIncluded: false,
        rawCustomerMessagesIncluded: false,
        workspaceScoped: true,
        piiMinimized: true,
      },
    });
  });
});
