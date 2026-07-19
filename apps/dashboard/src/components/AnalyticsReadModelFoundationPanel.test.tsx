import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalyticsReadModelFoundationPanel } from "./AnalyticsReadModelFoundationPanel";

describe("AnalyticsReadModelFoundationPanel", () => {
  it("renders foundation readiness without charts or export controls", () => {
    render(
      <AnalyticsReadModelFoundationPanel
        readiness={{
          workspaceId: "wks_demo",
          generatedAt: "2026-01-01T00:00:00.000Z",
          phase: "p9",
          readiness: {
            analyticsFoundationReady: true,
            metricRegistryReady: true,
            metricContractReady: true,
            runtimeMetricsImplemented: false,
            scheduledAggregationImplemented: false,
            reportExportImplemented: false,
          },
          allowedCategories: ["operational", "sla_readiness"],
          blockedCategories: ["raw_payload"],
          privacy: {
            workspaceScoped: true,
            aggregateFirst: true,
            rawPayloadIncluded: false,
            rawCustomerMessagesIncluded: false,
            piiMinimized: true,
            policyVersion: "p9-analytics-kpi-policy-v1",
          },
          safety: {
            readOnly: true,
            mutationAllowed: false,
            actionExecuted: false,
            crmMutationExecuted: false,
            taskCreated: false,
            outboundSent: false,
          },
        }}
        metricCatalog={{
          workspaceId: "wks_demo",
          generatedAt: "2026-01-01T00:00:00.000Z",
          categories: ["operational", "sla_readiness"],
          metrics: [],
        }}
      />,
    );

    expect(screen.getByText("Metric foundation")).toBeInTheDocument();
    expect(screen.getAllByText("not implemented yet").length).toBe(3);
    expect(screen.getByText("operational")).toBeInTheDocument();
    expect(screen.queryByText("Export")).not.toBeInTheDocument();
  });
});
