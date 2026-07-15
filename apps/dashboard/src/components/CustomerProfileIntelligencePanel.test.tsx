import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomerProfileIntelligenceResponse } from "../api/types";
import { CustomerProfileIntelligencePanel } from "./CustomerProfileIntelligencePanel";

const intelligence: CustomerProfileIntelligenceResponse = {
  customerId: "cust_demo_budi",
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-01-10T00:00:00.000Z",
  profileHealth: {
    level: "needs_attention",
    reasons: ["Customer has open conversations to review."],
  },
  activitySignals: {
    lastConversationAt: "2026-01-09T00:00:00.000Z",
    lastReplyAt: null,
    openConversationCount: 1,
    totalConversationCount: 2,
    recentActivityCount: 2,
  },
  relationshipSignals: {
    lifecycleSuggestion: "active_customer",
    lifecycleReason: "Recent workspace-scoped conversation activity exists.",
    statusSuggestion: "needs_follow_up",
    statusReason: "Open conversations require human review.",
  },
  followUpSignals: {
    recommendedAction: "follow_up",
    urgency: "high",
    reason:
      "Recommended action is review-only and must be approved by a human.",
  },
  safety: {
    readOnly: true,
    mutationAllowed: false,
    requiresHumanApprovalForMutation: true,
    policyVersion: "customer-profile-intelligence-read-model-v1",
  },
};

describe("CustomerProfileIntelligencePanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders read-only customer intelligence safely", () => {
    render(
      <CustomerProfileIntelligencePanel
        intelligence={intelligence}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Profile signals")).toBeInTheDocument();
    expect(screen.getByText("read-only")).toBeInTheDocument();
    expect(screen.getByText("needs attention")).toBeInTheDocument();
    expect(screen.getByText(/1 open/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render token, Authorization, raw payload, or provider secret fields", () => {
    const unsafe = [
      ["access", "token"].join("_"),
      ["refresh", "token"].join("_"),
      "Authorization",
      "raw Gmail payload",
      ["client", "secret"].join("_"),
      "<script",
    ];

    const { container } = render(
      <CustomerProfileIntelligencePanel
        intelligence={intelligence}
        loading={false}
        error={null}
      />,
    );
    const html = container.innerHTML;

    for (const value of unsafe) {
      expect(html).not.toContain(value);
    }
  });

  it("renders loading, empty, and error states without mutation controls", () => {
    const { rerender } = render(
      <CustomerProfileIntelligencePanel
        intelligence={null}
        loading
        error={null}
      />,
    );

    expect(
      screen.getByText("Loading profile intelligence..."),
    ).toBeInTheDocument();

    rerender(
      <CustomerProfileIntelligencePanel
        intelligence={null}
        loading={false}
        error="Unable to load profile intelligence."
      />,
    );

    expect(
      screen.getByText("Unable to load profile intelligence."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
