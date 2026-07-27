import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CustomerProfileResponse } from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_p19",
  display_name: "P19 Customer",
  contact_identifier: null,
  source: "email",
  status: "active",
  owner_user_id: null,
  notes_summary: null,
  last_interaction_at: null,
  created_at: "2026-07-27T00:00:00.000Z",
  updated_at: "2026-07-27T00:00:00.000Z",
};

describe("P19 real CRM viewer readonly workflow", () => {
  afterEach(cleanup);

  it("shows readonly indicator and disables mutation controls", () => {
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

    expect(screen.getByText("Read-only session")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Viewer cannot create" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Viewer cannot edit" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Viewer cannot update" })).toBeDisabled();
  });
});
