import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ConversationDetail } from "../api/types";
import { ConversationPane } from "./ConversationPane";

const conversation: ConversationDetail = {
  id: "conv_001",
  source: "email",
  provider: "gmail",
  status: "open",
  last_message_at: "2026-01-01T00:00:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  customer: {
    id: "cust_001",
    display_name: "Budi",
    source: "email",
    status: "active",
  },
  assigned_user: {
    id: "usr_agent",
    display_name: "Agent Demo",
  },
  messages: [
    {
      id: "msg_001",
      direction: "inbound",
      sender_type: "customer",
      sender_user_id: null,
      body: "Please check my order.",
      sent_at: "2026-01-01T00:00:00.000Z",
      delivery_status: "received",
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "msg_002",
      direction: "outbound",
      sender_type: "agent",
      sender_user_id: "usr_agent",
      body: "We will check it now.",
      sent_at: "2026-01-01T00:01:00.000Z",
      delivery_status: "sent",
      created_at: "2026-01-01T00:01:00.000Z",
    },
  ],
};

function renderPane(
  overrides: Partial<Parameters<typeof ConversationPane>[0]> = {},
) {
  const props: Parameters<typeof ConversationPane>[0] = {
    conversation,
    loading: false,
    error: null,
    composerValue: "Draft reply",
    onComposerChange: vi.fn(),
    onGenerateDraft: vi.fn(),
    onSendReply: vi.fn(),
    canGenerateDraft: true,
    canSendReply: true,
    isGeneratingDraft: false,
    isSendingReply: false,
    composerError: null,
    aiDraftLabel: "AI-assisted draft · Review before sending",
    readOnlyMessage: null,
    gmailOutboundStatus: null,
    gmailOutboundStatusLoading: false,
    gmailOutboundStatusError: null,
    webchatOutboundStatus: null,
    webchatOutboundStatusLoading: false,
    webchatOutboundStatusError: null,
  };

  return render(<ConversationPane {...props} {...overrides} />);
}

describe("ConversationPane", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders transcript, composer, and draft label as text", () => {
    renderPane();

    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.getByText("Please check my order.")).toBeInTheDocument();
    expect(screen.getByText("We will check it now.")).toBeInTheDocument();
    expect(
      screen.getByText("AI-assisted draft · Review before sending"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Reply" })).toBeEnabled();
  });

  it("keeps viewer composer read-only when write props are false", () => {
    renderPane({
      canGenerateDraft: false,
      canSendReply: false,
      readOnlyMessage: "You have view-only access to this conversation.",
    });

    expect(screen.getByText("View-only access")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Generate AI Draft" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Send Reply" }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Reply message draft")).toHaveAttribute(
      "readonly",
    );
  });

  it("renders loading, error, and empty conversation states", () => {
    const { rerender } = renderPane({ loading: true });

    expect(screen.getByText("Loading conversation...")).toBeInTheDocument();

    rerender(
      <ConversationPane
        conversation={null}
        loading={false}
        error="Conversation unavailable safely."
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
      />,
    );

    expect(
      screen.getByText("Conversation unavailable safely."),
    ).toBeInTheDocument();

    rerender(
      <ConversationPane
        conversation={null}
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
      />,
    );

    expect(
      screen.getByText("Select a conversation to view the message history."),
    ).toBeInTheDocument();
  });
});
