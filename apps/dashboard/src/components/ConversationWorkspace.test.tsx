import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type {
  ActivityResponse,
  ConversationDetail,
  ConversationSummary,
  CustomerProfileResponse,
} from "../api/types";
import workspaceSource from "./ConversationWorkspace.tsx?raw";
import { ConversationWorkspace } from "./ConversationWorkspace";

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
      body: "Need a safe text reply.",
      sent_at: "2026-01-01T00:00:00.000Z",
      delivery_status: "received",
      created_at: "2026-01-01T00:00:00.000Z",
    },
  ],
};

const conversationSummary: ConversationSummary = {
  id: conversation.id,
  source: conversation.source,
  provider: conversation.provider,
  status: conversation.status,
  snippet: "Need a safe text reply.",
  last_message_at: conversation.last_message_at,
  created_at: conversation.created_at,
  updated_at: conversation.updated_at,
  customer: conversation.customer,
  assigned_user: conversation.assigned_user,
};

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_001",
  display_name: "Budi",
  contact_identifier: "budi@example.test",
  source: "email",
  status: "active",
  notes_summary: "Prefers concise updates.",
  last_interaction_at: "2026-01-01T00:00:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const activity: ActivityResponse["data"]["items"] = [
  {
    id: "act_001",
    type: "conversation.created",
    title: "Conversation created",
    description: "Conversation was created from a safe channel event.",
    actor: {
      type: "system",
      id: null,
      name: "System",
    },
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

function renderWorkspace(
  overrides: Partial<Parameters<typeof ConversationWorkspace>[0]> = {},
) {
  const props: Parameters<typeof ConversationWorkspace>[0] = {
    scheduler: {
      status: {
        scheduler_enabled: true,
        scheduler_running: true,
        interval_ms: 300000,
        max_accounts_per_tick: 5,
        max_messages_per_account: 20,
        last_tick_status: "completed",
      },
      loading: false,
      error: null,
    },
    inbox: {
      conversations: [conversationSummary],
      selectedConversationId: conversation.id,
      statusFilter: "",
      search: "",
      loading: false,
      error: null,
      onSearchChange: vi.fn(),
      onStatusChange: vi.fn(),
      onSelectConversation: vi.fn(),
    },
    conversation: {
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
    },
    customer: {
      customer,
      customerLoading: false,
      customerError: null,
      activity,
      activityLoading: false,
      activityError: null,
    },
    customerIntelligence: {
      customerIntelligence: null,
      customerIntelligenceLoading: false,
      customerIntelligenceError: null,
      customerTimelineIntelligence: null,
      customerTimelineIntelligenceLoading: false,
      customerTimelineIntelligenceError: null,
      customerActionProposal: null,
      customerActionProposalLoading: false,
      customerActionProposalError: null,
      customerFollowUpProposal: null,
      customerFollowUpProposalLoading: false,
      customerFollowUpProposalError: null,
      customerOwnerAssignmentReadiness: null,
      customerOwnerAssignmentReadinessLoading: false,
      customerOwnerAssignmentReadinessError: null,
      customerLifecycleStatusReadiness: null,
      customerLifecycleStatusReadinessLoading: false,
      customerLifecycleStatusReadinessError: null,
    },
  };

  return render(<ConversationWorkspace {...props} {...overrides} />);
}

describe("ConversationWorkspace", () => {
  it("renders queue, conversation, customer, composer, and status areas", () => {
    renderWorkspace();

    expect(
      screen.getByRole("region", { name: "Conversation workspace" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Queue inbox")).toBeInTheDocument();
    expect(screen.getByLabelText("Active conversation")).toBeInTheDocument();
    expect(screen.getByLabelText("Customer context")).toBeInTheDocument();
    expect(screen.getByText("Inbound visibility")).toBeInTheDocument();
    expect(screen.getByText("Reply composer")).toBeInTheDocument();
    expect(screen.getByText("Lead workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Customer workspace")).toBeInTheDocument();
    expect(screen.getByText("Follow-up workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Insight workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Access workspace preview")).toBeInTheDocument();
  });

  it("renders loading, empty, and error states without fetching data", () => {
    renderWorkspace({
      inbox: {
        conversations: [],
        selectedConversationId: null,
        statusFilter: "",
        search: "",
        loading: false,
        error: "Unable to load inbox safely.",
        onSearchChange: vi.fn(),
        onStatusChange: vi.fn(),
        onSelectConversation: vi.fn(),
      },
      conversation: {
        conversation: null,
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
      },
      customer: {
        customer: null,
        customerLoading: false,
        customerError: null,
        activity: [],
        activityLoading: false,
        activityError: null,
      },
    });

    expect(
      screen.getByText("Unable to load inbox safely."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Select a conversation to view the message history."),
    ).toBeInTheDocument();
    expect(screen.getByText("No customer selected.")).toBeInTheDocument();
  });

  it("does not use unsafe rendering or token display patterns", () => {
    renderWorkspace();

    const body = document.body.textContent ?? "";
    const unsafeHtmlApi = ["dangerously", "Set", "Inner", "HTML"].join("");
    const serviceRole = ["service", "role"].join("_");
    const accessToken = ["access", "token"].join("_");
    const refreshToken = ["refresh", "token"].join("_");
    const clientSecret = ["client", "secret"].join("_");

    expect(workspaceSource).not.toContain(unsafeHtmlApi);
    expect(body).not.toContain(serviceRole);
    expect(body).not.toContain(accessToken);
    expect(body).not.toContain(refreshToken);
    expect(body).not.toContain("Authorization");
    expect(body).not.toContain(clientSecret);
  });
});
