import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  CustomerActivityTimelineEvent,
  CustomerNote,
  CustomerProfileResponse,
} from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_p13_notes",
  display_name: "Notes Customer",
  contact_identifier: "notes@example.test",
  source: "email",
  status: "active",
  notes_summary: "Safe preview.",
  last_interaction_at: null,
  created_at: "2026-07-22T00:00:00.000Z",
  updated_at: "2026-07-22T00:00:00.000Z",
};

const note: CustomerNote = {
  id: "note_p13_1",
  customer_id: customer.id,
  author_user_id: "usr_demo_agent",
  body: "Safe internal CRM note.",
  created_at: "2026-07-22T01:00:00.000Z",
  updated_at: "2026-07-22T01:00:00.000Z",
};

const timelineEvent: CustomerActivityTimelineEvent = {
  id: "event_p13_1",
  type: "customer.note.created",
  title: "Internal note added",
  summary: "A workspace operator added an internal customer note.",
  customer_id: customer.id,
  actor_user_id: "usr_demo_agent",
  occurred_at: "2026-07-22T01:00:00.000Z",
};

describe("P13 customer notes and activity timeline UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders notes and timeline for selected customer", () => {
    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        notes={[note]}
        timeline={[timelineEvent]}
        loading={false}
        error={null}
        successMessage={null}
        mutationError={null}
        noteError={null}
        isSaving={false}
        isSavingNote={false}
        readOnly={false}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
        onCreateCustomerNote={vi.fn()}
      />,
    );

    expect(screen.getByText("Customer notes")).toBeInTheDocument();
    expect(screen.getByText("Safe internal CRM note.")).toBeInTheDocument();
    expect(screen.getByText("Customer activity timeline")).toBeInTheDocument();
    expect(screen.getByText("Internal note added")).toBeInTheDocument();
  });

  it("submits valid customer note and shows loading state", async () => {
    const onCreateCustomerNote = vi.fn(async () => undefined);

    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        notes={[]}
        timeline={[]}
        loading={false}
        error={null}
        successMessage={null}
        mutationError={null}
        noteError={null}
        isSaving={false}
        isSavingNote={false}
        readOnly={false}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
        onCreateCustomerNote={onCreateCustomerNote}
      />,
    );

    fireEvent.change(screen.getByLabelText("Internal note"), {
      target: { value: "Follow up tomorrow." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add note" }));

    await waitFor(() => expect(onCreateCustomerNote).toHaveBeenCalled());
    expect(onCreateCustomerNote).toHaveBeenCalledWith(
      customer.id,
      "Follow up tomorrow.",
    );
  });

  it("validates empty and too-long notes before submit", () => {
    const onCreateCustomerNote = vi.fn();

    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        notes={[]}
        timeline={[]}
        loading={false}
        error={null}
        successMessage={null}
        mutationError={null}
        noteError={null}
        isSaving={false}
        isSavingNote={false}
        readOnly={false}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
        onCreateCustomerNote={onCreateCustomerNote}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add note" }));
    expect(screen.getByText("Note body is required.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Internal note"), {
      target: { value: "x".repeat(2001) },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add note" }));

    expect(screen.getByText("Note body is too long.")).toBeInTheDocument();
    expect(onCreateCustomerNote).not.toHaveBeenCalled();
  });
});
