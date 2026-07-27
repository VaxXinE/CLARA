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
  id: "cust_p19",
  display_name: "P19 Customer",
  contact_identifier: "p19@example.test",
  source: "email",
  status: "new",
  owner_user_id: null,
  notes_summary: "Safe summary.",
  last_interaction_at: null,
  created_at: "2026-07-27T00:00:00.000Z",
  updated_at: "2026-07-27T00:00:00.000Z",
};

describe("P19 real customer create/update workflow", () => {
  afterEach(cleanup);

  it("submits real internal CRM source instead of seeded demo source", async () => {
    const onCreateCustomer = vi.fn(async () => undefined);

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
        onCreateCustomer={onCreateCustomer}
        onUpdateCustomer={vi.fn()}
      />,
    );

    fireEvent.change(screen.getAllByLabelText("Name")[0], {
      target: { value: "Real CRM Lead" },
    });
    fireEvent.change(screen.getAllByLabelText("Contact")[0], {
      target: { value: "lead@example.test" },
    });
    fireEvent.change(screen.getAllByLabelText("Source")[0], {
      target: { value: "email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create customer" }));

    await waitFor(() => expect(onCreateCustomer).toHaveBeenCalled());
    expect(onCreateCustomer).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: "Real CRM Lead",
        contactIdentifier: "lead@example.test",
        source: "email",
        status: "new",
      }),
    );
    expect(JSON.stringify(onCreateCustomer.mock.calls)).not.toContain("demo");
  });

  it("submits safe update payload with editable source/status", async () => {
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
      target: { value: "Updated Real Customer" },
    });
    fireEvent.change(screen.getAllByLabelText("Source")[1], {
      target: { value: "webchat" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save customer" }));

    await waitFor(() => expect(onUpdateCustomer).toHaveBeenCalled());
    expect(onUpdateCustomer).toHaveBeenCalledWith(
      "cust_p19",
      expect.objectContaining({
        displayName: "Updated Real Customer",
        source: "webchat",
      }),
    );
  });
});
