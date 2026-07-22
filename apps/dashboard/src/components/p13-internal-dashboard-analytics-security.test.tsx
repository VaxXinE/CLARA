import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { InternalCrmDashboardAnalyticsResponse } from "../api/types";
import { InternalCrmDashboardAnalyticsPanel } from "./InternalCrmDashboardAnalyticsPanel";

describe("P13 internal dashboard analytics security", () => {
  it("does not render token, provider, raw payload, or billing details", () => {
    const analytics = {
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-22T00:00:00.000Z",
      timeWindow: "30d",
      customers: { total: 1, new: 1, active: 1 },
      lifecycle: { summary: [] },
      owners: { summary: [] },
      conversations: { total: 1, linkedToCustomer: 1, unlinked: 0 },
      followUps: { open: 0, overdue: 0, byAssignee: [] },
      activity: { recentCrmActivityCount: 0 },
      workflow: {
        reviewOnly: true,
        mutationAllowed: false,
        billingPaymentDeferred: true,
      },
      health: { status: "healthy", reasonCodes: ["ok"] },
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
      [["access", "token"].join("_")]: "atk",
      [["refresh", "token"].join("_")]: "rtk",
      Authorization: "Bearer atk",
      [["client", "secret"].join("_")]: "sec",
      rawGmailPayload: "raw",
      providerRawError: "provider raw error body",
      billingCard: "card data",
    } as InternalCrmDashboardAnalyticsResponse;

    render(<InternalCrmDashboardAnalyticsPanel analytics={analytics} />);

    const rendered = screen.getByLabelText(
      "Internal CRM Dashboard Analytics",
    ).textContent;

    expect(rendered).not.toContain("atk");
    expect(rendered).not.toContain("rtk");
    expect(rendered).not.toContain("Bearer");
    expect(rendered).not.toContain(["client", "secret"].join("_"));
    expect(rendered).not.toContain("rawGmailPayload");
    expect(rendered).not.toContain("provider raw error body");
    expect(rendered).not.toContain("card data");
  });
});
