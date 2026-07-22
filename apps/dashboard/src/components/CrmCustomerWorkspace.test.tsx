import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { ConversationDetail, CustomerProfileResponse } from "../api/types";
import workspaceSource from "./CrmCustomerWorkspace.tsx?raw";
import { CrmCustomerWorkspace } from "./CrmCustomerWorkspace";

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

describe("CrmCustomerWorkspace", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders CRM and customer intelligence planned sections", () => {
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
        customerActionProposal={null}
        customerActionProposalLoading={false}
        customerActionProposalError={null}
        customerFollowUpProposal={null}
        customerFollowUpProposalLoading={false}
        customerFollowUpProposalError={null}
        customerOwnerAssignmentReadiness={null}
        customerOwnerAssignmentReadinessLoading={false}
        customerOwnerAssignmentReadinessError={null}
        customerLifecycleStatusReadiness={null}
        customerLifecycleStatusReadinessLoading={false}
        customerLifecycleStatusReadinessError={null}
        readOnly={false}
      />,
    );

    expect(
      screen.getByRole("region", {
        name: "CRM and customer intelligence workspace",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Lead workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Customer workspace")).toBeInTheDocument();
    expect(screen.getAllByText("planned route")).toHaveLength(1);
  });

  it("renders placeholders safely without fetching or mutation", () => {
    render(
      <CrmCustomerWorkspace
        conversation={null}
        customer={null}
        customerIntelligence={null}
        customerIntelligenceLoading={false}
        customerIntelligenceError={null}
        customerTimelineIntelligence={null}
        customerTimelineIntelligenceLoading={false}
        customerTimelineIntelligenceError={null}
        customerActionProposal={null}
        customerActionProposalLoading={false}
        customerActionProposalError={null}
        customerFollowUpProposal={null}
        customerFollowUpProposalLoading={false}
        customerFollowUpProposalError={null}
        customerOwnerAssignmentReadiness={null}
        customerOwnerAssignmentReadinessLoading={false}
        customerOwnerAssignmentReadinessError={null}
        customerLifecycleStatusReadiness={null}
        customerLifecycleStatusReadinessLoading={false}
        customerLifecycleStatusReadinessError={null}
        readOnly
      />,
    );

    expect(screen.getByText("No active lead")).toBeInTheDocument();
    expect(screen.getByText("No customer selected")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Viewer cannot create" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Viewer cannot edit" }),
    ).toBeDisabled();
  });

  it("does not use unsafe rendering or token display patterns", () => {
    const unsafeHtmlApi = ["dangerously", "Set", "Inner", "HTML"].join("");
    const accessToken = ["access", "token"].join("_");
    const refreshToken = ["refresh", "token"].join("_");

    expect(workspaceSource).not.toContain(unsafeHtmlApi);
    expect(workspaceSource).not.toContain(accessToken);
    expect(workspaceSource).not.toContain(refreshToken);
    expect(workspaceSource).not.toContain("Authorization");
  });
});
