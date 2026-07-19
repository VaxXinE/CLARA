import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomerOwnerAssignmentReadinessResponse } from "../api/types";
import { CustomerOwnerAssignmentReadinessPanel } from "./CustomerOwnerAssignmentReadinessPanel";
import workspaceSource from "./CrmCustomerWorkspace.tsx?raw";
import panelSource from "./CustomerOwnerAssignmentReadinessPanel.tsx?raw";

const readiness: CustomerOwnerAssignmentReadinessResponse = {
  customerId: "cust_demo_budi",
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-01-10T00:00:00.000Z",
  readiness: {
    level: "ready_for_review",
    reasons: ["Owner assignment readiness is review-only."],
  },
  currentOwnership: {
    hasOwner: false,
    ownerId: null,
    ownerRole: null,
    ownershipSource: "unknown",
  },
  suggestedAssignment: {
    recommendedRole: "sales",
    recommendedAction: "assign_owner_review",
    reason: "Review owner handoff.",
    executionStatus: "review_only",
    ownerAssigned: false,
    requiresHumanApproval: true,
    requiredPermission: "customer:assign_owner",
  },
  risk: {
    level: "medium",
    reasons: ["Future owner changes require explicit human approval."],
    blocked: false,
    blockedReason: null,
  },
  safety: {
    readOnly: true,
    proposalOnly: true,
    ownerAssigned: false,
    mutationAllowed: false,
    actionExecuted: false,
    requiresHumanApprovalForMutation: true,
    policyVersion: "owner-assignment-readiness-v1",
  },
};

describe("P8 customer owner assignment readiness dashboard security", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps owner assignment readiness display-only and free of unsafe rendering", () => {
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

  it("does not render owner or CRM mutation controls", () => {
    render(
      <CustomerOwnerAssignmentReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    for (const label of [
      "Execute",
      "Apply",
      "Save",
      "Assign Owner",
      "Change Owner",
      "Create Task",
      "Schedule Task",
      "Send Message",
      "Change Status",
      "Update Lifecycle",
      "Write Note",
    ]) {
      expect(screen.queryByRole("button", { name: label })).toBeNull();
    }
  });
});
