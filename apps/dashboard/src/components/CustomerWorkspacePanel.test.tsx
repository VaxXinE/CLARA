import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CustomerProfileResponse, WorkspaceMember } from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

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

const activeMember: WorkspaceMember = {
  user_id: "usr_demo_agent",
  display_name: "Demo Agent",
  email: "agent@example.test",
  role: "agent",
  status: "active",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("CustomerWorkspacePanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders internal customer CRUD controls safely", () => {
    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        loading={false}
        error={null}
        successMessage={null}
        mutationError={null}
        isSaving={false}
        readOnly={false}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
        workspaceMembers={[activeMember]}
      />,
    );

    expect(screen.getByText("Customer workspace")).toBeInTheDocument();
    expect(screen.getAllByText("Budi").length).toBeGreaterThanOrEqual(2);
    expect(
      screen.getAllByText("email · budi@example.test").length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getByRole("button", { name: /Create customer/i }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: /Save customer/i }),
    ).toBeEnabled();
  });

  it("submits lifecycle status and owner assignment actions", async () => {
    const onUpdateCustomerStatus = vi.fn().mockResolvedValue(undefined);
    const onAssignCustomerOwner = vi.fn().mockResolvedValue(undefined);

    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
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
        workspaceMembers={[activeMember]}
      />,
    );

    fireEvent.change(
      screen.getByLabelText("Status", {
        selector: "#customer-lifecycle-status",
      }),
      {
        target: { value: "follow_up" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: /Update status/i }));

    fireEvent.change(screen.getByLabelText("Active member"), {
      target: { value: "usr_demo_agent" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Assign owner/i }));

    expect(onUpdateCustomerStatus).toHaveBeenCalledWith(
      "cust_001",
      "follow_up",
    );
    expect(onAssignCustomerOwner).toHaveBeenCalledWith(
      "cust_001",
      "usr_demo_agent",
    );
    expect(document.body.textContent).not.toContain("access_token");
    expect(document.body.textContent).not.toContain("raw Gmail payload");
  });

  it("validates create form before submitting", () => {
    const onCreateCustomer = vi.fn();
    render(
      <CustomerWorkspacePanel
        customer={null}
        customers={[]}
        loading={false}
        error={null}
        successMessage={null}
        mutationError={null}
        isSaving={false}
        readOnly={false}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={onCreateCustomer}
        onUpdateCustomer={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Create customer/i }));

    expect(screen.getByText("Customer name is required.")).toBeInTheDocument();
    expect(onCreateCustomer).not.toHaveBeenCalled();
  });

  it("renders read-only disabled reasons for viewer sessions", () => {
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
        onUpdateCustomerStatus={vi.fn()}
        onAssignCustomerOwner={vi.fn()}
        workspaceMembers={[activeMember]}
      />,
    );

    expect(screen.getByText("Read-only session")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Viewer cannot create/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Viewer cannot edit/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Viewer cannot update/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Viewer cannot assign/i }),
    ).toBeDisabled();
  });
});
