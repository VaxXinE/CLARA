import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CustomerProfileResponse } from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_p13_final",
  display_name: "P13 Final Customer",
  contact_identifier: "p13-final@example.test",
  source: "email",
  status: "active",
  notes_summary: null,
  owner_user_id: "usr_demo_agent",
  last_interaction_at: null,
  created_at: "2026-07-23T00:00:00.000Z",
  updated_at: "2026-07-23T00:00:00.000Z",
};

describe("P13 final internal CRM readonly dashboard security", () => {
  afterEach(() => cleanup());

  it("renders viewer copy and disables CRM mutation controls", () => {
    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        loading={false}
        error={null}
        successMessage={null}
        mutationError={null}
        isSaving={false}
        readOnly={true}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
      />,
    );

    expect(screen.getByText("Read-only")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Viewer cannot create" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Viewer cannot edit" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Viewer cannot update" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Viewer cannot assign" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Viewer cannot add task" }),
    ).toBeDisabled();
  });
});
