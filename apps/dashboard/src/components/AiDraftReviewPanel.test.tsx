import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AiDraftReview } from "../api/types";
import { AiDraftReviewPanel } from "./AiDraftReviewPanel";

const baseReview: AiDraftReview = {
  draftId: "draft_demo",
  suggestionId: "sug_demo",
  conversationId: "conv_demo",
  customerId: "cust_demo",
  workspaceId: "wks_demo_sales",
  channel: "gmail",
  status: "suggested",
  draftText: "Thanks for reaching out.",
  editedText: null,
  reviewedByUserId: null,
  approvedAt: null,
  rejectedAt: null,
  safeReasonCode: "ai_human_approval_required",
  safetyFlags: ["human_approval_required"],
  requiresHumanApproval: true,
  policyVersion: "p7_ai_draft_review_v1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("AiDraftReviewPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders review controls without provider send action", () => {
    render(
      <AiDraftReviewPanel
        review={baseReview}
        loading={false}
        error={null}
        canReview={true}
        onEdit={vi.fn()}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    );

    expect(screen.getByText("Human approval")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve draft" })).toBeEnabled();
    expect(
      screen.queryByRole("button", { name: /send/i }),
    ).not.toBeInTheDocument();
  });

  it("saves edited review text through the provided callback", () => {
    const onEdit = vi.fn();
    render(
      <AiDraftReviewPanel
        review={baseReview}
        loading={false}
        error={null}
        canReview={true}
        onEdit={onEdit}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("AI draft review text"), {
      target: {
        value: "Edited human-approved wording.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save review edit" }));

    expect(onEdit).toHaveBeenCalledWith("Edited human-approved wording.");
  });

  it("does not render sensitive provider material", () => {
    render(
      <AiDraftReviewPanel
        review={{
          ...baseReview,
          draftText: "Safe draft text",
          safetyFlags: ["safe_context"],
        }}
        loading={false}
        error={null}
        canReview={true}
        onEdit={vi.fn()}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    );

    const html = document.body.textContent ?? "";
    expect(html).not.toContain(["access", "token"].join("_"));
    expect(html).not.toContain(["refresh", "token"].join("_"));
    expect(html).not.toContain(["rawProvider", "Payload"].join(""));
    expect(html).not.toContain(["Authori", "zation"].join(""));
  });
});
