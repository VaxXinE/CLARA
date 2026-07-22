import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { InternalCrmDashboardAnalyticsResponse } from "../api/types";
import { InternalCrmDashboardAnalyticsPanel } from "./InternalCrmDashboardAnalyticsPanel";

const analytics: InternalCrmDashboardAnalyticsResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-22T00:00:00.000Z",
  timeWindow: "30d",
  customers: { total: 12, new: 3, active: 7 },
  lifecycle: { summary: [{ status: "active", count: 7 }] },
  owners: {
    summary: [
      { ownerUserId: "usr_demo_agent", totalCustomers: 4, activeCustomers: 3 },
    ],
  },
  conversations: { total: 9, linkedToCustomer: 8, unlinked: 1 },
  followUps: {
    open: 5,
    overdue: 1,
    byAssignee: [{ assigneeUserId: "usr_demo_agent", openCount: 5 }],
  },
  activity: { recentCrmActivityCount: 6 },
  workflow: {
    reviewOnly: true,
    mutationAllowed: false,
    billingPaymentDeferred: true,
  },
  health: { status: "attention", reasonCodes: ["overdue_follow_ups"] },
  safety: {
    aggregated: true,
    workspaceScoped: true,
    readOnly: true,
    rawPayloadIncluded: false,
    tokensIncluded: false,
    billingPaymentIncluded: false,
    providerAiOutboundIncluded: false,
    heavyAnalyticsJobCreated: false,
    exportCreated: false,
  },
};

describe("P13 internal dashboard analytics wiring", () => {
  it("renders actionable internal CRM aggregate cards", () => {
    render(<InternalCrmDashboardAnalyticsPanel analytics={analytics} />);

    expect(screen.getByText("Internal CRM Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Customers")).toBeInTheDocument();
    expect(screen.getByText("Active customers")).toBeInTheDocument();
    expect(screen.getByText("Linked conversations")).toBeInTheDocument();
    expect(screen.getByText("Open follow-ups")).toBeInTheDocument();
    expect(screen.getByText("Recent CRM activity")).toBeInTheDocument();
    expect(screen.getByText("Health: attention")).toBeInTheDocument();
  });

  it("renders loading and error states without dead buttons", () => {
    render(
      <InternalCrmDashboardAnalyticsPanel
        analytics={null}
        loading={true}
        error="Internal CRM analytics unavailable."
      />,
    );

    expect(
      screen.getByText("Loading internal CRM analytics."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Internal CRM analytics unavailable."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
