import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomerFollowUpProposalResponse } from "../api/types";
import { CustomerFollowUpProposalPanel } from "./CustomerFollowUpProposalPanel";
import workspaceSource from "./CrmCustomerWorkspace.tsx?raw";
import panelSource from "./CustomerFollowUpProposalPanel.tsx?raw";

const proposal: CustomerFollowUpProposalResponse = {
  proposalId: "follow_up_proposal_follow_up_customer_cust_demo_budi",
  customerId: "cust_demo_budi",
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-01-10T00:00:00.000Z",
  title: "Review task / follow-up workflow proposal",
  summary: "Review-only follow-up proposal.",
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

describe("P8 customer follow-up proposal dashboard security", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps follow-up proposal display-only and free of unsafe rendering", () => {
    const source = `${workspaceSource}\n${panelSource}`;

    for (const value of [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
      "rawPrompt",
    ]) {
      expect(source).not.toContain(value);
    }
  });

  it("does not render task or workflow mutation controls", () => {
    render(
      <CustomerFollowUpProposalPanel
        proposal={proposal}
        loading={false}
        error={null}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    for (const label of [
      "Execute",
      "Apply",
      "Save",
      "Create Task",
      "Schedule Task",
      "Assign Owner",
      "Change Status",
      "Update Lifecycle",
      "Send Message",
      "Write Note",
    ]) {
      expect(screen.queryByRole("button", { name: label })).toBeNull();
    }
  });
});
