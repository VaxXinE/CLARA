import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ConversationDetail, CustomerProfileResponse } from "../api/types";
import { ConversationPane } from "./ConversationPane";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_p19",
  display_name: "P19 Customer",
  contact_identifier: "p19@example.test",
  source: "email",
  status: "active",
  owner_user_id: null,
  notes_summary: null,
  last_interaction_at: null,
  created_at: "2026-07-27T00:00:00.000Z",
  updated_at: "2026-07-27T00:00:00.000Z",
};

const conversation: ConversationDetail = {
  id: "conv_p19",
  source: "email",
  provider: "gmail",
  status: "open",
  last_message_at: null,
  created_at: "2026-07-27T00:00:00.000Z",
  updated_at: "2026-07-27T00:00:00.000Z",
  customer: null,
  assigned_user: null,
  messages: [],
};

describe("P19 real conversation customer linking workflow", () => {
  afterEach(cleanup);

  it("links conversation to customer explicitly", () => {
    const onLinkCustomer = vi.fn();

    render(
      <ConversationPane
        conversation={conversation}
        loading={false}
        error={null}
        composerValue=""
        onComposerChange={vi.fn()}
        onGenerateDraft={vi.fn()}
        onSendReply={vi.fn()}
        canGenerateDraft={false}
        canSendReply={false}
        isGeneratingDraft={false}
        isSendingReply={false}
        composerError={null}
        aiDraftLabel={null}
        readOnlyMessage={null}
        gmailOutboundStatus={null}
        gmailOutboundStatusLoading={false}
        gmailOutboundStatusError={null}
        webchatOutboundStatus={null}
        webchatOutboundStatusLoading={false}
        webchatOutboundStatusError={null}
        customers={[customer]}
        onLinkCustomer={onLinkCustomer}
      />,
    );

    fireEvent.change(screen.getByLabelText("Link existing customer"), {
      target: { value: "cust_p19" },
    });

    expect(onLinkCustomer).toHaveBeenCalledWith("cust_p19");
    expect(document.body.textContent).not.toContain("raw_provider");
  });
});
