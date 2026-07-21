import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ComposerPanel } from "./ComposerPanel";

describe("ComposerPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows a read-only notice for viewer state", () => {
    render(
      <ComposerPanel
        value=""
        onChange={vi.fn()}
        onGenerateDraft={vi.fn()}
        onSendReply={vi.fn()}
        canGenerateDraft={false}
        canSendReply={false}
        isGeneratingDraft={false}
        isSendingReply={false}
        error={null}
        aiDraftLabel={null}
        readOnlyMessage="You have view-only access to this conversation."
      />,
    );

    expect(screen.getByText("View-only access")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Generate AI Draft" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Send Reply" }),
    ).not.toBeInTheDocument();
  });

  it("renders AI draft label when a draft is ready", () => {
    render(
      <ComposerPanel
        value="Hi Budi, thanks for reaching out."
        onChange={vi.fn()}
        onGenerateDraft={vi.fn()}
        onSendReply={vi.fn()}
        canGenerateDraft={true}
        canSendReply={true}
        isGeneratingDraft={false}
        isSendingReply={false}
        error={null}
        aiDraftLabel="AI-assisted draft · Review before sending"
        readOnlyMessage={null}
      />,
    );

    expect(
      screen.getByText("AI-assisted draft · Review before sending"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Generate AI Draft" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Reply" })).toBeEnabled();
  });

  it("blocks reply send when an AI draft review is not approved", () => {
    render(
      <ComposerPanel
        value="Hi Budi, thanks for reaching out."
        onChange={vi.fn()}
        onGenerateDraft={vi.fn()}
        onSendReply={vi.fn()}
        canGenerateDraft={true}
        canSendReply={true}
        isGeneratingDraft={false}
        isSendingReply={false}
        error={null}
        aiDraftLabel="AI-assisted draft · Review before sending"
        readOnlyMessage={null}
        aiDraftReview={{
          draftId: "draft_demo",
          suggestionId: null,
          conversationId: "conv_demo",
          customerId: "cust_demo",
          workspaceId: "wks_demo_sales",
          channel: "gmail",
          status: "suggested",
          draftText: "Hi Budi, thanks for reaching out.",
          editedText: null,
          reviewedByUserId: null,
          approvedAt: null,
          rejectedAt: null,
          safeReasonCode: "ai_human_approval_required",
          safetyFlags: [],
          requiresHumanApproval: true,
          policyVersion: "p7_ai_draft_review_v1",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByRole("button", { name: "Send Reply" })).toBeDisabled();
  });

  it("supports local draft copy, clear, saved feedback, and disabled send reason", () => {
    const onCopyDraft = vi.fn();
    const onClearDraft = vi.fn();

    render(
      <ComposerPanel
        value="Local safe draft"
        onChange={vi.fn()}
        onGenerateDraft={vi.fn()}
        onSendReply={vi.fn()}
        onClearDraft={onClearDraft}
        onCopyDraft={onCopyDraft}
        canGenerateDraft={true}
        canSendReply={true}
        isGeneratingDraft={false}
        isSendingReply={false}
        error={null}
        aiDraftLabel={null}
        draftStatusMessage="Draft saved locally in this browser session."
        sendDisabledReason="Approve the AI draft review before sending."
        readOnlyMessage={null}
        aiDraftReview={{
          draftId: "draft_demo",
          suggestionId: null,
          conversationId: "conv_demo",
          customerId: "cust_demo",
          workspaceId: "wks_demo_sales",
          channel: "gmail",
          status: "suggested",
          draftText: "Local safe draft",
          editedText: null,
          reviewedByUserId: null,
          approvedAt: null,
          rejectedAt: null,
          safeReasonCode: "ai_human_approval_required",
          safetyFlags: [],
          requiresHumanApproval: true,
          policyVersion: "p7_ai_draft_review_v1",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy draft" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear draft" }));

    expect(onCopyDraft).toHaveBeenCalledOnce();
    expect(onClearDraft).toHaveBeenCalledOnce();
    expect(
      screen.getByText("Draft saved locally in this browser session."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Approve the AI draft review before sending."),
    ).toBeInTheDocument();
  });
});
