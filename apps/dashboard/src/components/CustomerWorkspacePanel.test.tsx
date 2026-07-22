import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CustomerProfileResponse } from "../api/types";
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
      />,
    );

    expect(screen.getByText("Read-only session")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Viewer cannot create/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Viewer cannot edit/i }),
    ).toBeDisabled();
  });
});
