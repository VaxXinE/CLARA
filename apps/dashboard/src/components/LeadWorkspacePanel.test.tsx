import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { ConversationDetail } from "../api/types";
import { LeadWorkspacePanel } from "./LeadWorkspacePanel";

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
  messages: [],
};

describe("LeadWorkspacePanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders stage, owner, follow-up, and pipeline placeholders", () => {
    render(<LeadWorkspacePanel conversation={conversation} readOnly={false} />);

    expect(screen.getByText("Lead workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Stage")).toBeInTheDocument();
    expect(screen.getByText("open")).toBeInTheDocument();
    expect(screen.getByText("Agent Demo")).toBeInTheDocument();
    expect(
      screen.getByText("Planned follow-up placeholder"),
    ).toBeInTheDocument();
    expect(screen.getByText("Pipeline placeholder")).toBeInTheDocument();
  });

  it("handles missing conversation and viewer-safe read-only state", () => {
    render(<LeadWorkspacePanel conversation={null} readOnly={true} />);

    expect(screen.getByText("No active lead")).toBeInTheDocument();
    expect(screen.getByText("Select a conversation first")).toBeInTheDocument();
    expect(screen.getByText(/Viewer mode is read-only/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
