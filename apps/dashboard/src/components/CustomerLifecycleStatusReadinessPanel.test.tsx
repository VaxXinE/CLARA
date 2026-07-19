import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomerLifecycleStatusReadinessResponse } from "../api/types";
import { CustomerLifecycleStatusReadinessPanel } from "./CustomerLifecycleStatusReadinessPanel";

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
    level: "no_change_recommended",
    reasons: ["No lifecycle/status change is recommended."],
  },
  suggestedChange: {
    recommendedLifecycle: "no_change",
    recommendedStatus: "no_change",
    recommendedAction: "no_op",
    reason: "Current lifecycle/status does not need a change.",
    executionStatus: "review_only",
    lifecycleUpdated: false,
    statusUpdated: false,
    requiresHumanApproval: true,
    requiredPermission: "customer:read",
  },
  transitionPolicy: {
    allowedForReview: true,
    blockedReason: null,
    warnings: ["No lifecycle was updated.", "No customer status was updated."],
  },
  risk: {
    level: "low",
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

describe("CustomerLifecycleStatusReadinessPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders review-only lifecycle/status readiness without mutation controls", () => {
    render(
      <CustomerLifecycleStatusReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Status readiness")).toBeInTheDocument();
    expect(screen.getByText("readiness-only")).toBeInTheDocument();
    expect(screen.getByText(/lifecycleUpdated=false/)).toBeInTheDocument();
    expect(screen.getByText(/statusUpdated=false/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render token, raw payload, provider secret, or unsafe HTML fields", () => {
    const { container } = render(
      <CustomerLifecycleStatusReadinessPanel
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
