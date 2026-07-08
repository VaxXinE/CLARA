import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ComposerPanel } from "./ComposerPanel";

describe("ComposerPanel", () => {
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
    expect(
      screen.getByRole("button", { name: "Send Reply" }),
    ).toBeEnabled();
  });
});
