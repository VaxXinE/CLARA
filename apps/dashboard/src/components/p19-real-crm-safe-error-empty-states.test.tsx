import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

describe("P19 real CRM safe error and empty states", () => {
  afterEach(cleanup);

  it("guides real internal customer entry without demo language or secrets", () => {
    render(
      <CustomerWorkspacePanel
        customer={null}
        customers={[]}
        loading={false}
        error="Customer list unavailable."
        successMessage={null}
        mutationError="Customer could not be created."
        isSaving={false}
        readOnly={false}
        onSelectCustomer={vi.fn()}
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
      />,
    );

    expect(screen.getByText("Customer list unavailable.")).toBeInTheDocument();
    expect(screen.getByText("Customer could not be created.")).toBeInTheDocument();
    expect(document.body.textContent).toContain(
      "Create the first internal CRM record",
    );
    expect(document.body.textContent).not.toContain("access_token");
    expect(document.body.textContent).not.toContain("client_secret");
  });
});
