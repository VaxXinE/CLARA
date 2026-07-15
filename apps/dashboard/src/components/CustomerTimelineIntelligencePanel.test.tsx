import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomerTimelineIntelligenceResponse } from "../api/types";
import { CustomerTimelineIntelligencePanel } from "./CustomerTimelineIntelligencePanel";

const intelligence: CustomerTimelineIntelligenceResponse = {
  customerId: "cust_demo_budi",
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-01-10T00:00:00.000Z",
  timeline: {
    events: [
      {
        id: "event_1",
        occurredAt: "2026-01-09T00:00:00.000Z",
        type: "inbound_message",
        source: "conversation",
        title: "Inbound message received",
        summary: "Customer asked about stock.",
        channel: "gmail",
        conversationId: "conv_demo_budi_stock",
        severity: "attention",
        safeMetadata: {
          delivery_status: "received",
        },
      },
    ],
  },
  intelligence: {
    keyMoments: ["1 workspace-scoped conversation found."],
    recentSignals: ["1 open conversation needs review."],
    riskFlags: ["Open conversation requires human follow-up review."],
    followUpHints: ["Review open conversations before proposing action."],
  },
  safety: {
    readOnly: true,
    mutationAllowed: false,
    requiresHumanApprovalForMutation: true,
    policyVersion: "customer-timeline-intelligence-read-model-v1",
  },
};

describe("CustomerTimelineIntelligencePanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders read-only timeline intelligence safely", () => {
    render(
      <CustomerTimelineIntelligencePanel
        intelligence={intelligence}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Timeline intelligence")).toBeInTheDocument();
    expect(screen.getByText("review-only")).toBeInTheDocument();
    expect(screen.getByText("Inbound message received")).toBeInTheDocument();
    expect(screen.getByText("Customer asked about stock.")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render token, Authorization, raw payload, provider secret, or unsafe HTML fields", () => {
    const { container } = render(
      <CustomerTimelineIntelligencePanel
        intelligence={intelligence}
        loading={false}
        error={null}
      />,
    );
    const html = container.innerHTML;
    const unsafe = [
      ["access", "token"].join("_"),
      ["refresh", "token"].join("_"),
      "Authorization",
      "raw Gmail payload",
      "raw provider payload",
      ["client", "secret"].join("_"),
      "<script",
    ];

    for (const value of unsafe) {
      expect(html).not.toContain(value);
    }
  });

  it("renders loading, empty, and error states without mutation controls", () => {
    const { rerender } = render(
      <CustomerTimelineIntelligencePanel
        intelligence={null}
        loading
        error={null}
      />,
    );

    expect(
      screen.getByText("Loading timeline intelligence..."),
    ).toBeInTheDocument();

    rerender(
      <CustomerTimelineIntelligencePanel
        intelligence={null}
        loading={false}
        error="Unable to load timeline intelligence."
      />,
    );

    expect(
      screen.getByText("Unable to load timeline intelligence."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
