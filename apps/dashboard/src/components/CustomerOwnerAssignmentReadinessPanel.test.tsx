import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomerOwnerAssignmentReadinessResponse } from "../api/types";
import { CustomerOwnerAssignmentReadinessPanel } from "./CustomerOwnerAssignmentReadinessPanel";

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
    reason: "Review sales ownership.",
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

describe("CustomerOwnerAssignmentReadinessPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders review-only owner assignment readiness without mutation controls", () => {
    render(
      <CustomerOwnerAssignmentReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Assignment readiness")).toBeInTheDocument();
    expect(screen.getByText("readiness-only")).toBeInTheDocument();
    expect(screen.getByText(/ownerAssigned=false/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render token, raw payload, provider secret, or unsafe HTML fields", () => {
    const { container } = render(
      <CustomerOwnerAssignmentReadinessPanel
        readiness={readiness}
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
