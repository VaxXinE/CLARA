import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  CustomerActivityTimelineEvent,
  CustomerNote,
  CustomerProfileResponse,
} from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_p19",
  display_name: "P19 Customer",
  contact_identifier: "p19@example.test",
  source: "email",
  status: "active",
  owner_user_id: null,
  notes_summary: null,
  last_interaction_at: null,
  created_at: "2026-07-27T00:00:00.000Z",
  updated_at: "2026-07-27T00:00:00.000Z",
};

const note: CustomerNote = {
  id: "note_p19",
  customer_id: "cust_p19",
  author_user_id: "usr_agent",
  body: "Safe workspace note",
  created_at: "2026-07-27T00:00:00.000Z",
  updated_at: "2026-07-27T00:00:00.000Z",
};

const event: CustomerActivityTimelineEvent = {
  id: "event_p19",
  type: "customer.note.created",
  title: "Internal note added",
  summary: "A workspace operator added an internal customer note.",
  customer_id: "cust_p19",
  actor_user_id: "usr_agent",
  occurred_at: "2026-07-27T00:00:00.000Z",
};

describe("P19 real customer notes/activity workflow", () => {
  afterEach(cleanup);

  it("adds notes and renders safe activity timeline", async () => {
    const onCreateCustomerNote = vi.fn(async () => undefined);

    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        notes={[note]}
        timeline={[event]}
        loading={false}
        error={null}
        successMessage={null}
        mutationError={null}
        isSaving={false}
        readOnly={false}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
        onCreateCustomerNote={onCreateCustomerNote}
      />,
    );

    fireEvent.change(screen.getByLabelText("Internal note"), {
      target: { value: "New operator note" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add note" }));

    await waitFor(() => expect(onCreateCustomerNote).toHaveBeenCalled());
    expect(onCreateCustomerNote).toHaveBeenCalledWith(
      "cust_p19",
      "New operator note",
    );
    expect(screen.getByText("Safe workspace note")).toBeInTheDocument();
    expect(screen.getByText("Internal note added")).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("access_token");
    expect(document.body.textContent).not.toContain("raw_provider");
  });
});
