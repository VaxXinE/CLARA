import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { InternalCrmDashboardAnalyticsResponse } from "../api/types";
import { InternalCrmDashboardAnalyticsPanel } from "./InternalCrmDashboardAnalyticsPanel";

const analytics: InternalCrmDashboardAnalyticsResponse = {
  workspaceId: "wks_demo_sales",
  timeWindow: "30d",
  generatedAt: "2026-07-23T00:00:00.000Z",
  customers: {
    total: 12,
    new: 2,
    active: 8,
  },
  lifecycle: {
    summary: [{ status: "active", count: 8 }],
  },
  owners: {
    summary: [
      {
        ownerUserId: "usr_demo_agent",
        totalCustomers: 4,
        activeCustomers: 3,
      },
    ],
  },
  conversations: {
    total: 20,
    linkedToCustomer: 14,
    unlinked: 6,
  },
  followUps: {
    open: 5,
    overdue: 1,
    byAssignee: [{ assigneeUserId: "usr_demo_agent", openCount: 5 }],
  },
  activity: {
    recentCrmActivityCount: 9,
  },
  workflow: {
    reviewOnly: true,
    mutationAllowed: false,
    billingPaymentDeferred: true,
  },
  health: {
    status: "healthy",
    reasonCodes: ["ok"],
  },
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

describe("P13 final internal CRM E2E QA dashboard", () => {
  afterEach(() => cleanup());

  it("renders internal CRM aggregate analytics as read-only dashboard evidence", () => {
    render(
      <InternalCrmDashboardAnalyticsPanel
        analytics={analytics}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Internal CRM Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Customers")).toBeInTheDocument();
    expect(screen.getByText("Linked conversations")).toBeInTheDocument();
    expect(screen.getByText("Open follow-ups")).toBeInTheDocument();
    expect(screen.getByText("Health: healthy")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
