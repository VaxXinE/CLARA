import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  CustomerFollowUpTask,
  CustomerProfileResponse,
} from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_demo_budi",
  display_name: "Budi Santoso",
  contact_identifier: "budi@example.test",
  source: "email",
  status: "active",
  owner_user_id: null,
  notes_summary: "Safe summary.",
  last_interaction_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const task: CustomerFollowUpTask = {
  id: "task_demo",
  customer_id: "cust_demo_budi",
  title: "Safe follow-up",
  body: "Workspace-scoped task",
  status: "open",
  due_at: null,
  assignee_user_id: null,
  created_by_user_id: "usr_demo_agent",
  completed_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("P13 follow-up task dashboard security", () => {
  afterEach(() => cleanup());

  it("renders safe task data without tokens, raw payloads, or raw HTML", () => {
    render(
      <CustomerWorkspacePanel
        customer={customer}
        customers={[customer]}
        tasks={[task]}
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

    const html = document.body.innerHTML;

    expect(screen.getByText("Safe follow-up")).toBeInTheDocument();
    expect(html).not.toContain("access_token");
    expect(html).not.toContain("refresh_token");
    expect(html).not.toContain("Authorization");
    expect(html).not.toContain("client_secret");
    expect(html).not.toContain("raw_provider");
    expect(html).not.toContain("dangerouslySetInnerHTML");
  });
});
