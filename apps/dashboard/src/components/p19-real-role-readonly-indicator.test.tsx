import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ComposerPanel } from "./ComposerPanel";

describe("P19 real role readonly indicator", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps viewer read-only access visibly indicated", () => {
    render(
      <ComposerPanel
        value=""
        onChange={() => undefined}
        onGenerateDraft={() => undefined}
        onSendReply={() => undefined}
        canGenerateDraft={false}
        canSendReply={false}
        isGeneratingDraft={false}
        isSendingReply={false}
        readOnlyMessage="Viewer role can inspect workspace data but cannot mutate CRM records."
        error={null}
        draftStatusMessage={null}
        aiDraftLabel={null}
      />,
    );

    expect(screen.getByText("View-only access")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Send Reply" })).not.toBeInTheDocument();
  });
});
