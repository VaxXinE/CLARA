import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CustomerProfileResponse, WorkspaceMember } from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_demo_budi",
  display_name: "Budi Santoso",
  contact_identifier: "budi@example.test",
  source: "email",
  status: "active",
  owner_user_id: null,
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

describe("P13 customer lifecycle owner assignment dashboard", () => {
  afterEach(() => cleanup());

  it("renders usable lifecycle and owner controls for operators", () => {
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
        onUpdateCustomerStatus={vi.fn()}
        onAssignCustomerOwner={vi.fn()}
      />,
    );

    expect(screen.getByText("Lifecycle status")).toBeInTheDocument();
    expect(screen.getByText("Owner assignment")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update status" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Assign owner" })).toBeDisabled();
  });

  it("calls lifecycle and owner handlers instead of rendering dead buttons", () => {
    const onUpdateCustomerStatus = vi.fn().mockResolvedValue(undefined);
    const onAssignCustomerOwner = vi.fn().mockResolvedValue(undefined);

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
        onUpdateCustomerStatus={onUpdateCustomerStatus}
        onAssignCustomerOwner={onAssignCustomerOwner}
      />,
    );

    fireEvent.change(
      screen.getByLabelText("Status", {
        selector: "#customer-lifecycle-status",
      }),
      { target: { value: "at_risk" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Update status" }));

    fireEvent.change(screen.getByLabelText("Active member"), {
      target: { value: "usr_demo_agent" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Assign owner" }));

    expect(onUpdateCustomerStatus).toHaveBeenCalledWith(
      "cust_demo_budi",
      "at_risk",
    );
    expect(onAssignCustomerOwner).toHaveBeenCalledWith(
      "cust_demo_budi",
      "usr_demo_agent",
    );
  });
});
