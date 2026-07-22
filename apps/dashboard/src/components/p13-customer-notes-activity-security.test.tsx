import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  CustomerActivityTimelineEvent,
  CustomerNote,
  CustomerProfileResponse,
} from "../api/types";
import source from "./CustomerWorkspacePanel.tsx?raw";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_p13_secure",
  display_name: "Secure Customer",
  contact_identifier: "secure@example.test",
  source: "email",
  status: "active",
  notes_summary: "Safe preview.",
  last_interaction_at: null,
  created_at: "2026-07-22T00:00:00.000Z",
  updated_at: "2026-07-22T00:00:00.000Z",
};

describe("P13 customer notes and activity security UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("does not use unsafe HTML rendering for notes or timeline", () => {
    expect(source).not.toContain("dangerouslySetInnerHTML");
  });

  it("does not render token, auth header, raw provider, or secret fields", () => {
    const unsafeNote = {
      id: "note_secure",
      customer_id: customer.id,
      author_user_id: "usr_demo_agent",
      body: "<script>alert(1)</script>",
      created_at: "2026-07-22T01:00:00.000Z",
      updated_at: "2026-07-22T01:00:00.000Z",
    } satisfies CustomerNote;
    const timeline = [
      {
        id: "event_secure",
        type: "customer.note.created",
        title: "Internal note added",
        summary: "A workspace operator added an internal customer note.",
        customer_id: customer.id,
        actor_user_id: "usr_demo_agent",
        occurred_at: "2026-07-22T01:00:00.000Z",
      },
    ] satisfies CustomerActivityTimelineEvent[];

    const { container } = render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        notes={[unsafeNote]}
        timeline={timeline}
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

    expect(screen.getByText("<script>alert(1)</script>")).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).not.toContain("access_token");
    expect(container.textContent).not.toContain("refresh_token");
    expect(container.textContent).not.toContain("Authorization");
    expect(container.textContent).not.toContain("client_secret");
    expect(container.textContent).not.toContain("raw_provider");
  });
});
