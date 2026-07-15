import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomerActionProposalResponse } from "../api/types";
import { CustomerActionProposalPanel } from "./CustomerActionProposalPanel";

const proposal: CustomerActionProposalResponse = {
  proposalId: "crm_proposal_follow_up_task_review_cust_demo_budi",
  customerId: "cust_demo_budi",
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-01-10T00:00:00.000Z",
  proposalType: "follow_up_task_review",
  title: "Review follow-up task proposal",
  summary: "Review-only proposal for Budi.",
  proposedAction: {
    actionKind: "create_task",
    executionStatus: "review_only",
    mutationExecuted: false,
    requiresHumanApproval: true,
    requiredPermission: "task:create",
  },
  risk: {
    level: "medium",
    reasons: ["Proposal is review-only and needs explicit human approval."],
    blocked: false,
    blockedReason: null,
  },
  review: {
    reviewLabel: "Ready for human review",
    nextStep: "Review details before using a later approved mutation flow.",
    warnings: ["No CRM mutation was executed."],
  },
  safety: {
    readOnly: true,
    proposalOnly: true,
    mutationAllowed: false,
    actionExecuted: false,
    requiresHumanApprovalForMutation: true,
    policyVersion: "reviewable-crm-action-proposal-v1",
  },
};

describe("CustomerActionProposalPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders proposal-only CRM action review safely", () => {
    render(
      <CustomerActionProposalPanel
        proposal={proposal}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Reviewable action proposal")).toBeInTheDocument();
    expect(screen.getByText("proposal-only")).toBeInTheDocument();
    expect(screen.getByText(/mutationExecuted=false/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render token, Authorization, raw payload, provider secret, or unsafe HTML fields", () => {
    const { container } = render(
      <CustomerActionProposalPanel
        proposal={proposal}
        loading={false}
        error={null}
      />,
    );
    const html = container.innerHTML;

    for (const value of [
      "access_token",
      "refresh_token",
      "Authorization",
      "raw provider payload",
      "raw webhook payload",
      "client_secret",
      "<script",
    ]) {
      expect(html).not.toContain(value);
    }
  });

  it("renders loading, empty, and error states without mutation controls", () => {
    const { rerender } = render(
      <CustomerActionProposalPanel proposal={null} loading error={null} />,
    );

    expect(screen.getByText("Loading action proposal...")).toBeInTheDocument();

    rerender(
      <CustomerActionProposalPanel
        proposal={null}
        loading={false}
        error="Unable to load action proposal."
      />,
    );

    expect(
      screen.getByText("Unable to load action proposal."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
