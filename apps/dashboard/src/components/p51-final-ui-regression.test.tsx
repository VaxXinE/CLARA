import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  ActivityResponse,
  ConversationDetail,
  ConversationSummary,
  CustomerProfileResponse,
} from "../api/types";
import { ActionInsightAdminWorkspace } from "./ActionInsightAdminWorkspace";
import { ConversationWorkspace } from "./ConversationWorkspace";
import { CrmCustomerWorkspace } from "./CrmCustomerWorkspace";
import { WorkspaceNavigation } from "./WorkspaceNavigation";
import { WorkspaceShell } from "./WorkspaceShell";

const conversation: ConversationDetail = {
  id: "conv_p51",
  source: "email",
  provider: "gmail",
  status: "open",
  last_message_at: "2026-01-01T00:00:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  customer: {
    id: "cust_p51",
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
      id: "msg_p51",
      direction: "inbound",
      sender_type: "customer",
      sender_user_id: null,
      body: "Need help with the order.",
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
  snippet: "Need help with the order.",
  last_message_at: conversation.last_message_at,
  created_at: conversation.created_at,
  updated_at: conversation.updated_at,
  customer: conversation.customer,
  assigned_user: conversation.assigned_user,
};

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_p51",
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
    id: "act_p51",
    type: "conversation.created",
    title: "Conversation created",
    description: "Safe demo event.",
    actor: {
      type: "system",
      id: null,
      name: "System",
    },
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

function renderConversationWorkspace(input?: { readOnly?: boolean }) {
  const readOnly = input?.readOnly ?? false;

  return render(
    <ConversationWorkspace
      scheduler={{
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
      }}
      inbox={{
        conversations: [conversationSummary],
        selectedConversationId: conversation.id,
        statusFilter: "",
        search: "",
        loading: false,
        error: null,
        onSearchChange: vi.fn(),
        onStatusChange: vi.fn(),
        onSelectConversation: vi.fn(),
      }}
      conversation={{
        conversation,
        loading: false,
        error: null,
        composerValue: readOnly ? "" : "Draft reply",
        onComposerChange: vi.fn(),
        onGenerateDraft: vi.fn(),
        onSendReply: vi.fn(),
        canGenerateDraft: !readOnly,
        canSendReply: !readOnly,
        isGeneratingDraft: false,
        isSendingReply: false,
        composerError: null,
        aiDraftLabel: readOnly
          ? null
          : "AI-assisted draft - Review before sending",
        readOnlyMessage: readOnly ? "Viewer role is read-only." : null,
        gmailOutboundStatus: null,
        gmailOutboundStatusLoading: false,
        gmailOutboundStatusError: null,
        webchatOutboundStatus: null,
        webchatOutboundStatusLoading: false,
        webchatOutboundStatusError: null,
      }}
      customer={{
        customer,
        customerLoading: false,
        customerError: null,
        activity,
        activityLoading: false,
        activityError: null,
      }}
      customerIntelligence={{
        customerIntelligence: null,
        customerIntelligenceLoading: false,
        customerIntelligenceError: null,
        customerTimelineIntelligence: null,
        customerTimelineIntelligenceLoading: false,
        customerTimelineIntelligenceError: null,
      }}
    />,
  );
}

describe("P5.1 final UI regression", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps the shell, topbar, sidebar, navigation, and main workspace intact", () => {
    render(
      <WorkspaceShell
        title="Conversation workspace"
        authSlot={<span>Demo auth</span>}
        metaSlot={<span>Workspace: demo</span>}
        navigationRole="owner"
      >
        <section>Dashboard content</section>
      </WorkspaceShell>,
    );

    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toHaveTextContent(
      "Conversation workspace",
    );
    expect(screen.getByRole("navigation")).toHaveTextContent(
      "Queue / Chat Masuk",
    );
    expect(screen.getByRole("main")).toHaveTextContent("Dashboard content");
  });

  it("keeps grouped role-aware navigation labels", () => {
    render(<WorkspaceNavigation role="owner" />);

    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("Oversight")).toBeInTheDocument();
    expect(screen.getByText("Administration")).toBeInTheDocument();
    expect(screen.getByText("CRM / Leads")).toBeInTheDocument();
    expect(screen.getByText("Manager Insights")).toBeInTheDocument();
    expect(screen.getByText("Access Control")).toBeInTheDocument();
  });

  it("keeps the conversation, CRM, action, insight, and admin workspace surfaces", () => {
    renderConversationWorkspace();

    expect(screen.getByLabelText("Queue inbox")).toBeInTheDocument();
    expect(screen.getByLabelText("Active conversation")).toBeInTheDocument();
    expect(screen.getByLabelText("Customer context")).toBeInTheDocument();
    expect(screen.getByText("Reply composer")).toBeInTheDocument();
    expect(screen.getByText("Lead workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Customer workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Follow-up workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Insight workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Access workspace preview")).toBeInTheDocument();
  });

  it("keeps planned placeholder pages non-mutating", () => {
    render(
      <CrmCustomerWorkspace
        conversation={conversation}
        customer={customer}
        customerIntelligence={null}
        customerIntelligenceLoading={false}
        customerIntelligenceError={null}
        customerTimelineIntelligence={null}
        customerTimelineIntelligenceLoading={false}
        customerTimelineIntelligenceError={null}
        readOnly
      />,
    );
    render(<ActionInsightAdminWorkspace readOnly />);

    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
  });

  it("keeps viewer/read-only workspace safe", () => {
    renderConversationWorkspace({ readOnly: true });

    expect(screen.getByText("View-only access")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Generate AI Draft" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Send Reply" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Access changes disabled" }),
    ).toBeDisabled();
  });
});
