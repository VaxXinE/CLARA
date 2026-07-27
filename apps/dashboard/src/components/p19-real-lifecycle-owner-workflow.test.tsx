import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CustomerProfileResponse, WorkspaceMember } from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_p19",
  display_name: "P19 Customer",
  contact_identifier: null,
  source: "extension_bridge",
  status: "new",
  owner_user_id: null,
  notes_summary: null,
  last_interaction_at: null,
  created_at: "2026-07-27T00:00:00.000Z",
  updated_at: "2026-07-27T00:00:00.000Z",
};

const activeMember: WorkspaceMember = {
  user_id: "usr_agent",
  display_name: "Agent",
  email: "agent@example.test",
  role: "agent",
  status: "active",
  created_at: "2026-07-27T00:00:00.000Z",
  updated_at: "2026-07-27T00:00:00.000Z",
};

describe("P19 real lifecycle owner workflow", () => {
  afterEach(cleanup);

  it("uses active workspace members for lifecycle and owner controls", () => {
    const onUpdateCustomerStatus = vi.fn(async () => undefined);
    const onAssignCustomerOwner = vi.fn(async () => undefined);

    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        workspaceMembers={[activeMember]}
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

    fireEvent.change(screen.getByLabelText("Status", { selector: "#customer-lifecycle-status" }), {
      target: { value: "follow_up" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update status" }));
    fireEvent.change(screen.getByLabelText("Active member"), {
      target: { value: "usr_agent" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Assign owner" }));

    expect(onUpdateCustomerStatus).toHaveBeenCalledWith("cust_p19", "follow_up");
    expect(onAssignCustomerOwner).toHaveBeenCalledWith("cust_p19", "usr_agent");
  });
});
