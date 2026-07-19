import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiCard } from "./KpiCard";
import type { KpiDashboardResponse } from "../api/types";

const card: KpiDashboardResponse["cards"][number] = {
  cardKey: "crm_workflow_reviews",
  label: "CRM workflow reviews",
  description: "Review-only CRM workflow proposals surfaced.",
  value: 2,
  valueType: "count",
  category: "crm_workflow",
  severity: "neutral",
  source: "crm_workflow_metrics",
  privacy: {
    aggregated: true,
    workspaceScoped: true,
    rawPayloadIncluded: false,
    rawCustomerMessagesIncluded: false,
    piiMinimized: true,
  },
};

describe("KpiCard", () => {
  it("renders one aggregate KPI card", () => {
    render(<KpiCard card={card} />);

    expect(screen.getByText("CRM workflow reviews")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.queryByText("Send Message")).not.toBeInTheDocument();
  });
});
