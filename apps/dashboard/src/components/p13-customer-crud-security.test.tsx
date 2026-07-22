import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CustomerProfileResponse } from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_p13_security",
  display_name: "Security Customer",
  contact_identifier: "security@example.test",
  source: "email",
  status: "active",
  notes_summary: "<script>unsafe()</script> safe text",
  last_interaction_at: null,
  created_at: "2026-07-22T00:00:00.000Z",
  updated_at: "2026-07-22T00:00:00.000Z",
};

describe("P13 customer CRUD security UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("does not render tokens, Authorization headers, or raw provider payload fields", () => {
    const { container } = render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        loading={false}
        error={null}
        successMessage="Customer updated."
        mutationError={null}
        isSaving={false}
        readOnly={false}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
      />,
    );

    const rendered = container.textContent ?? "";

    expect(rendered).not.toContain("access_token");
    expect(rendered).not.toContain("refresh_token");
    expect(rendered).not.toContain("Authorization");
    expect(rendered).not.toContain("client_secret");
    expect(rendered).not.toContain("raw_provider_payload");
    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByText("Customer updated.")).toBeInTheDocument();
  });

  it("shows explicit disabled reasons for read-only viewer sessions", () => {
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
