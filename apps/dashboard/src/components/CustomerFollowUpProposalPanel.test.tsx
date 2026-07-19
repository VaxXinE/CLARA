import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomerFollowUpProposalResponse } from "../api/types";
import { CustomerFollowUpProposalPanel } from "./CustomerFollowUpProposalPanel";

const proposal: CustomerFollowUpProposalResponse = {
  proposalId: "follow_up_proposal_follow_up_customer_cust_demo_budi",
  customerId: "cust_demo_budi",
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-01-10T00:00:00.000Z",
  title: "Review task / follow-up workflow proposal",
  summary: "Review-only follow-up proposal for Budi.",
  followUp: {
    intent: "follow_up_customer",
    recommendedChannel: "email",
    urgency: "medium",
    dueWindow: "next_24h",
    reason: "Review before task creation.",
  },
  proposedTask: {
    taskTitle: "Review follow-up task",
    taskDescription: "Review whether a human-approved task should be created.",
    executionStatus: "review_only",
    taskCreated: false,
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
    nextStep: "Review details before a later approved task flow.",
    warnings: ["No task was created."],
  },
  safety: {
    readOnly: true,
    proposalOnly: true,
    taskCreated: false,
    mutationAllowed: false,
    actionExecuted: false,
    requiresHumanApprovalForMutation: true,
    policyVersion: "task-follow-up-workflow-proposal-v1",
  },
};

describe("CustomerFollowUpProposalPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders review-only follow-up proposal without mutation controls", () => {
    render(
      <CustomerFollowUpProposalPanel
        proposal={proposal}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Task workflow review")).toBeInTheDocument();
    expect(screen.getByText("review-only")).toBeInTheDocument();
    expect(screen.getByText(/taskCreated=false/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render token, raw payload, provider secret, or unsafe HTML fields", () => {
    const { container } = render(
      <CustomerFollowUpProposalPanel
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
});
