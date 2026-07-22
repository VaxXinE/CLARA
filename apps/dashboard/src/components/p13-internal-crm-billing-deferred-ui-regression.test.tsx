import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

describe("P13 internal CRM billing deferred UI regression", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders customer CRUD without billing/payment activation controls", () => {
    const { container } = render(
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
        onCreateCustomer={vi.fn()}
        onUpdateCustomer={vi.fn()}
      />,
    );

    const rendered = container.textContent ?? "";

    expect(rendered).not.toMatch(/checkout|invoice|subscription/i);
    expect(rendered).not.toMatch(/charge customer|payment provider/i);
    expect(container.querySelector("script")).toBeNull();
  });
});
