import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { ConversationDetail } from "../api/types";
import { ConversationPane } from "./ConversationPane";

const conversation: ConversationDetail = {
  id: "conv_safe",
  source: "email",
  provider: "gmail",
  status: "open",
  last_message_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  customer: null,
  assigned_user: null,
  messages: [
    {
      id: "msg_safe",
      direction: "inbound",
      sender_type: "customer",
      sender_user_id: null,
      body: "<script>alert('xss')</script>",
      sent_at: "2026-01-01T00:00:00.000Z",
      delivery_status: "received",
      created_at: "2026-01-01T00:00:00.000Z",
    },
  ],
};

describe("P13 conversation customer linking UI security", () => {
  afterEach(() => {
    cleanup();
  });

  it("does not render tokens, raw provider payloads, or raw HTML execution", () => {
    render(
      <ConversationPane
        conversation={conversation}
        loading={false}
        error={null}
        composerValue=""
        onComposerChange={() => {}}
        onGenerateDraft={() => {}}
        onSendReply={() => {}}
        canGenerateDraft={false}
        canSendReply={false}
        isGeneratingDraft={false}
        isSendingReply={false}
        composerError={null}
        aiDraftLabel={null}
        readOnlyMessage="Viewer sessions cannot change links."
        customerLinkingDisabled={true}
        gmailOutboundStatus={null}
        gmailOutboundStatusLoading={false}
        gmailOutboundStatusError={null}
        webchatOutboundStatus={null}
        webchatOutboundStatusLoading={false}
        webchatOutboundStatusError={null}
      />,
    );

    expect(screen.getByText("Unlinked customer")).toBeInTheDocument();
    expect(document.body.querySelector("script")).toBeNull();
    expect(document.body.textContent).not.toContain("access_token");
    expect(document.body.textContent).not.toContain("refresh_token");
    expect(document.body.textContent).not.toContain("Authorization");
    expect(document.body.textContent).not.toContain("raw_provider_payload");
    expect(document.body.innerHTML).not.toContain("<script>alert");
  });
});
