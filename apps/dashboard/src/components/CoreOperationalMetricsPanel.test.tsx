import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CoreOperationalMetricsPanel } from "./CoreOperationalMetricsPanel";
import type {
  AnalyticsOverviewResponse,
  CoreOperationalMetricsResponse,
} from "../api/types";

const safety = {
  readOnly: true,
  mutationAllowed: false,
  actionExecuted: false,
  crmMutationExecuted: false,
  taskCreated: false,
  outboundSent: false,
  customerLevelDrilldown: false,
  reportExported: false,
} as const;

const section: CoreOperationalMetricsResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-07T10:00:00.000Z",
  timeWindow: "last_7_days",
  channel: "all",
  category: "operational",
  metrics: [
    {
      metricKey: "conversation_total",
      label: "Total conversations",
      description: "Total workspace conversations.",
      value: 3,
      valueType: "count",
      aggregationLevel: "workspace",
      implementationStatus: "implemented",
      privacy: {
        aggregated: true,
        rawPayloadIncluded: false,
        rawCustomerMessagesIncluded: false,
        workspaceScoped: true,
        piiMinimized: true,
        policyVersion: "p9-analytics-kpi-policy-v1",
      },
    },
  ],
  safety,
};

const overview: AnalyticsOverviewResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-07T10:00:00.000Z",
  timeWindow: "last_7_days",
  channel: "all",
  sections: {
    conversationVolume: section,
    responseTimeSla: { ...section, category: "sla_readiness" },
    channelPerformance: { ...section, category: "channel_performance" },
  },
  safety,
};

describe("CoreOperationalMetricsPanel", () => {
  it("renders aggregate operational sections without mutation controls", () => {
    render(<CoreOperationalMetricsPanel overview={overview} />);

    expect(
      screen.getByText("Core Operational Metrics Pack"),
    ).toBeInTheDocument();
    expect(screen.getByText("Conversation Volume Metrics")).toBeInTheDocument();
    expect(screen.getByText("Response Time / SLA")).toBeInTheDocument();
    expect(screen.getByText("Channel Performance Metrics")).toBeInTheDocument();
    expect(screen.getAllByText("Total conversations: 3").length).toBe(3);
    expect(screen.queryByText("Export")).not.toBeInTheDocument();
    expect(screen.queryByText("Send Message")).not.toBeInTheDocument();
  });
});
