import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CustomerProfileResponse } from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_p13_001",
  display_name: "P13 Customer",
  contact_identifier: "p13@example.test",
  source: "email",
  status: "new",
  notes_summary: "Safe note preview.",
  last_interaction_at: null,
  created_at: "2026-07-22T00:00:00.000Z",
  updated_at: "2026-07-22T00:00:00.000Z",
};

describe("P13 customer CRUD activation UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders customer list and allows selecting customer detail", () => {
    const onSelectCustomer = vi.fn();

    render(
      <CustomerWorkspacePanel
        customer={null}
        customers={[customer]}
        loading={false}
        error={null}
        successMessage={null}
        mutationError={null}
        isSaving={false}
        readOnly={false}
        onSelectCustomer={onSelectCustomer}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /P13 Customer/i }));

    expect(onSelectCustomer).toHaveBeenCalledWith(customer);
  });

  it("submits safe create customer payload", async () => {
    const onCreateCustomer = vi.fn(async () => undefined);

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

    fireEvent.change(screen.getAllByLabelText("Name")[0], {
      target: { value: "New CRM Lead" },
    });
    fireEvent.change(screen.getAllByLabelText("Contact")[0], {
      target: { value: "lead@example.test" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Create customer/i }));

    await waitFor(() => expect(onCreateCustomer).toHaveBeenCalled());
    expect(onCreateCustomer).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: "New CRM Lead",
        contactIdentifier: "lead@example.test",
        source: "demo",
        status: "new",
      }),
    );
  });

  it("submits safe edit customer payload", async () => {
    const onUpdateCustomer = vi.fn(async () => undefined);

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
        onUpdateCustomer={onUpdateCustomer}
      />,
    );

    fireEvent.change(screen.getAllByLabelText("Name")[1], {
      target: { value: "Updated Customer" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save customer/i }));

    await waitFor(() => expect(onUpdateCustomer).toHaveBeenCalled());
    expect(onUpdateCustomer).toHaveBeenCalledWith(
      "cust_p13_001",
      expect.objectContaining({
        displayName: "Updated Customer",
        status: "new",
      }),
    );
  });
});
