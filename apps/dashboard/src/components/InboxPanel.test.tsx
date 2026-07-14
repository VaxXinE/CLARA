import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ConversationSummary } from "../api/types";
import { InboxPanel } from "./InboxPanel";

const conversation: ConversationSummary = {
  id: "conv_001",
  source: "email",
  provider: "gmail",
  status: "open",
  snippet: "Need help with order status.",
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
};

function renderInbox(
  overrides: Partial<Parameters<typeof InboxPanel>[0]> = {},
) {
  const props: Parameters<typeof InboxPanel>[0] = {
    conversations: [conversation],
    selectedConversationId: conversation.id,
    statusFilter: "",
    search: "",
    loading: false,
    error: null,
    onSearchChange: vi.fn(),
    onStatusChange: vi.fn(),
    onSelectConversation: vi.fn(),
  };

  return render(<InboxPanel {...props} {...overrides} />);
}

describe("InboxPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders operator-friendly conversation rows as safe text", () => {
    renderInbox();

    expect(screen.getByText("Conversations")).toBeInTheDocument();
    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.getByText("Gmail")).toBeInTheDocument();
    expect(
      screen.getByText("Need help with order status."),
    ).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveClass("is-selected");
  });

  it("calls selection handler explicitly", async () => {
    const onSelectConversation = vi.fn();

    renderInbox({ onSelectConversation });

    await userEvent.click(screen.getByRole("listitem"));

    expect(onSelectConversation).toHaveBeenCalledWith("conv_001");
  });

  it("renders loading, error, and empty states", () => {
    const { rerender } = renderInbox({ loading: true });

    expect(screen.getByText("Loading conversations...")).toBeInTheDocument();

    rerender(
      <InboxPanel
        conversations={[]}
        selectedConversationId={null}
        statusFilter=""
        search=""
        loading={false}
        error="Unable to load conversations safely."
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onSelectConversation={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Unable to load conversations safely."),
    ).toBeInTheDocument();

    rerender(
      <InboxPanel
        conversations={[]}
        selectedConversationId={null}
        statusFilter=""
        search=""
        loading={false}
        error={null}
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onSelectConversation={vi.fn()}
      />,
    );

    expect(screen.getByText("No conversations yet.")).toBeInTheDocument();
  });
});
