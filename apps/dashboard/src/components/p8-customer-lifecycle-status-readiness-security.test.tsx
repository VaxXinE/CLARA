import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomerLifecycleStatusReadinessResponse } from "../api/types";
import { CustomerLifecycleStatusReadinessPanel } from "./CustomerLifecycleStatusReadinessPanel";
import workspaceSource from "./CrmCustomerWorkspace.tsx?raw";
import panelSource from "./CustomerLifecycleStatusReadinessPanel.tsx?raw";

const readiness: CustomerLifecycleStatusReadinessResponse = {
  customerId: "cust_demo_budi",
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-01-10T00:00:00.000Z",
  currentState: {
    lifecycle: "active_customer",
    status: "engaged",
    source: "existing_customer_record",
  },
  readiness: {
    level: "ready_for_review",
    reasons: ["Lifecycle/status readiness is review-only."],
  },
  suggestedChange: {
    recommendedLifecycle: "at_risk",
    recommendedStatus: "needs_follow_up",
    recommendedAction: "review_lifecycle_status",
    reason: "Review lifecycle/status manually.",
    executionStatus: "review_only",
    lifecycleUpdated: false,
    statusUpdated: false,
    requiresHumanApproval: true,
    requiredPermission: "customer:update",
  },
  transitionPolicy: {
    allowedForReview: true,
    blockedReason: null,
    warnings: ["Human approval is required before any future change."],
  },
  risk: {
    level: "medium",
    reasons: [
      "Future lifecycle/status changes require explicit human approval.",
    ],
    blocked: false,
    blockedReason: null,
  },
  safety: {
    readOnly: true,
    proposalOnly: true,
    lifecycleUpdated: false,
    statusUpdated: false,
    mutationAllowed: false,
    actionExecuted: false,
    requiresHumanApprovalForMutation: true,
    policyVersion: "lifecycle-status-update-readiness-v1",
  },
};

describe("P8 customer lifecycle status readiness dashboard security", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps lifecycle/status readiness display-only and free of unsafe rendering", () => {
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

  it("does not render lifecycle/status mutation controls", () => {
    render(
      <CustomerLifecycleStatusReadinessPanel
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
      "Change Status",
      "Update Lifecycle",
      "Create Task",
      "Schedule Task",
      "Send Message",
      "Write Note",
      "Assign Owner",
    ]) {
      expect(screen.queryByRole("button", { name: label })).toBeNull();
    }
  });
});
