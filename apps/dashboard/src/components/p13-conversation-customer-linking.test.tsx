import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  ConversationDetail,
  ConversationSummary,
  CustomerProfileResponse,
} from "../api/types";
import { ConversationPane } from "./ConversationPane";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_001",
  display_name: "Budi",
  contact_identifier: "budi@example.test",
  source: "email",
  status: "active",
  owner_user_id: null,
  notes_summary: "Safe summary.",
  last_interaction_at: "2026-01-01T00:00:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const linkedConversation: ConversationDetail = {
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
  assigned_user: null,
  messages: [],
};

function baseConversationPaneProps(
  conversation: ConversationDetail,
): Parameters<typeof ConversationPane>[0] {
  return {
    conversation,
    loading: false,
    error: null,
    composerValue: "",
    onComposerChange: vi.fn(),
    onGenerateDraft: vi.fn(),
    onSendReply: vi.fn(),
    canGenerateDraft: false,
    canSendReply: false,
    isGeneratingDraft: false,
    isSendingReply: false,
    composerError: null,
    aiDraftLabel: null,
    readOnlyMessage: null,
    gmailOutboundStatus: null,
    gmailOutboundStatusLoading: false,
    gmailOutboundStatusError: null,
    webchatOutboundStatus: null,
    webchatOutboundStatusLoading: false,
    webchatOutboundStatusError: null,
  };
}

describe("P13 conversation customer linking UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows linked customer state with working open and unlink actions", () => {
    const onOpenLinkedCustomer = vi.fn();
    const onUnlinkCustomer = vi.fn();

    render(
      <ConversationPane
        {...baseConversationPaneProps(linkedConversation)}
        onOpenLinkedCustomer={onOpenLinkedCustomer}
        onUnlinkCustomer={onUnlinkCustomer}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open customer" }));
    fireEvent.click(screen.getByRole("button", { name: "Unlink" }));

    expect(screen.getByText(/Linked to Budi/)).toBeInTheDocument();
    expect(onOpenLinkedCustomer).toHaveBeenCalledOnce();
    expect(onUnlinkCustomer).toHaveBeenCalledOnce();
  });

  it("shows unlinked state and links to an existing customer through selector", () => {
    const onLinkCustomer = vi.fn();

    render(
      <ConversationPane
        {...baseConversationPaneProps({
          ...linkedConversation,
          customer: null,
        })}
        customers={[customer]}
        onLinkCustomer={onLinkCustomer}
      />,
    );

    fireEvent.change(screen.getByLabelText("Link existing customer"), {
      target: { value: "cust_001" },
    });

    expect(screen.getByText("Unlinked customer")).toBeInTheDocument();
    expect(onLinkCustomer).toHaveBeenCalledWith("cust_001");
  });

  it("shows linked conversations on customer detail with open action", () => {
    const onOpenConversation = vi.fn();
    const linkedSummary: ConversationSummary = {
      id: "conv_001",
      source: "email",
      provider: "gmail",
      status: "open",
      snippet: "Safe snippet",
      last_message_at: "2026-01-01T00:00:00.000Z",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
      customer: {
        id: "cust_001",
        display_name: "Budi",
        source: "email",
        status: "active",
      },
      assigned_user: null,
    };

    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        loading={false}
        error={null}
        successMessage={null}
        mutationError={null}
        isSaving={false}
        readOnly={false}
        linkedConversations={[linkedSummary]}
        onOpenConversation={onOpenConversation}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open conversation" }));

    expect(screen.getByText("Linked conversations")).toBeInTheDocument();
    expect(screen.getByText("Safe snippet")).toBeInTheDocument();
    expect(onOpenConversation).toHaveBeenCalledWith("conv_001");
  });
});
