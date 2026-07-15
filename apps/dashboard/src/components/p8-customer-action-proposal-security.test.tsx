import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomerActionProposalResponse } from "../api/types";
import { CustomerActionProposalPanel } from "./CustomerActionProposalPanel";
import workspaceSource from "./CrmCustomerWorkspace.tsx?raw";
import panelSource from "./CustomerActionProposalPanel.tsx?raw";

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

describe("P8 customer action proposal dashboard security", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps CRM action proposal display-only and free of unsafe rendering", () => {
    const source = `${workspaceSource}\n${panelSource}`;
    const unsafe = [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "Authorization",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
      "rawPrompt",
    ];

    for (const value of unsafe) {
      expect(source).not.toContain(value);
    }
  });

  it("does not render CRM mutation controls", () => {
    render(
      <CustomerActionProposalPanel
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
      "Assign Owner",
      "Change Status",
      "Update Lifecycle",
      "Write Note",
    ]) {
      expect(screen.queryByRole("button", { name: label })).toBeNull();
    }
  });
});
