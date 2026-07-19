import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiDashboardCardsPanel } from "./KpiDashboardCardsPanel";
import type { KpiDashboardResponse } from "../api/types";

const dashboard: KpiDashboardResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T01:00:00.000Z",
  timeWindow: "last_7_days",
  cards: [
    {
      cardKey: "total_conversations",
      label: "Total conversations",
      description: "Aggregate workspace conversation volume.",
      value: 3,
      valueType: "count",
      category: "operational",
      severity: "neutral",
      source: "core_operational_metrics",
      privacy: {
        aggregated: true,
        workspaceScoped: true,
        rawPayloadIncluded: false,
        rawCustomerMessagesIncluded: false,
        piiMinimized: true,
      },
    },
  ],
  safety: {
    readOnly: true,
    exportEnabled: false,
    drilldownEnabled: false,
    mutationAllowed: false,
  },
};

describe("KpiDashboardCardsPanel", () => {
  it("renders safe KPI cards without mutation controls", () => {
    render(<KpiDashboardCardsPanel dashboard={dashboard} />);

    expect(screen.getByText("KPI Dashboard Cards")).toBeInTheDocument();
    expect(screen.getByText("Total conversations")).toBeInTheDocument();
    expect(screen.queryByText("Export")).not.toBeInTheDocument();
    expect(screen.queryByText("Create Task")).not.toBeInTheDocument();
  });
});
