import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CustomerProfileResponse, WorkspaceMember } from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_demo_budi",
  display_name: "Budi Santoso",
  contact_identifier: "budi@example.test",
  source: "email",
  status: "follow_up",
  owner_user_id: "usr_demo_agent",
  notes_summary: "Safe summary.",
  last_interaction_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const member: WorkspaceMember = {
  user_id: "usr_demo_agent",
  display_name: "Demo Agent",
  email: "agent@example.test",
  role: "agent",
  status: "active",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("P13 customer lifecycle owner dashboard security", () => {
  afterEach(() => cleanup());

  it("keeps viewer lifecycle and owner mutation controls disabled", () => {
    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        workspaceMembers={[member]}
        loading={false}
        error={null}
        successMessage={null}
        mutationError={null}
        isSaving={false}
        readOnly={true}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
        onUpdateCustomerStatus={vi.fn()}
        onAssignCustomerOwner={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Viewer cannot update" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Viewer cannot assign" }),
    ).toBeDisabled();
  });

  it("does not render raw payloads, tokens, secrets, or unsafe HTML", () => {
    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        workspaceMembers={[member]}
        loading={false}
        error={null}
        successMessage={null}
        mutationError={null}
        isSaving={false}
        readOnly={false}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
      />,
    );

    expect(document.body.innerHTML).not.toContain("access_token");
    expect(document.body.innerHTML).not.toContain("refresh_token");
    expect(document.body.innerHTML).not.toContain("Authorization");
    expect(document.body.innerHTML).not.toContain("client_secret");
    expect(document.body.innerHTML).not.toContain("raw_provider");
    expect(document.body.innerHTML).not.toContain("<script");
  });
});
