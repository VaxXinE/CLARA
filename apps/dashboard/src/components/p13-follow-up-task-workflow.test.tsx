import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  CustomerFollowUpTask,
  CustomerProfileResponse,
  WorkspaceMember,
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

const member: WorkspaceMember = {
  user_id: "usr_demo_agent",
  display_name: "Demo Agent",
  email: "agent@example.test",
  role: "agent",
  status: "active",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const task: CustomerFollowUpTask = {
  id: "task_demo",
  customer_id: "cust_demo_budi",
  title: "Call Budi",
  body: "Confirm renewal",
  status: "open",
  due_at: "2030-01-02T00:00:00.000Z",
  assignee_user_id: "usr_demo_agent",
  created_by_user_id: "usr_demo_agent",
  completed_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

function renderPanel(overrides = {}) {
  return render(
    <CustomerWorkspacePanel
      customer={customer}
      customers={[customer]}
      workspaceMembers={[member]}
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
      {...overrides}
    />,
  );
}

describe("P13 follow-up task dashboard workflow", () => {
  afterEach(() => cleanup());

  it("renders task list and submits a valid task", () => {
    const onCreateCustomerFollowUpTask = vi.fn().mockResolvedValue(undefined);
    renderPanel({ onCreateCustomerFollowUpTask });

    expect(screen.getByText("Follow-up tasks")).toBeInTheDocument();
    expect(screen.getByText("Call Budi")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Task title"), {
      target: { value: "Schedule demo" },
    });
    fireEvent.change(screen.getByLabelText("Due date"), {
      target: { value: "2030-01-03" },
    });
    fireEvent.change(screen.getByLabelText("Assignee"), {
      target: { value: "usr_demo_agent" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(onCreateCustomerFollowUpTask).toHaveBeenCalledWith(
      "cust_demo_budi",
      expect.objectContaining({
        title: "Schedule demo",
        dueAt: "2030-01-03",
        assigneeUserId: "usr_demo_agent",
      }),
    );
  });

  it("rejects empty title and updates task status", () => {
    const onUpdateCustomerFollowUpTaskStatus = vi
      .fn()
      .mockResolvedValue(undefined);
    renderPanel({
      onCreateCustomerFollowUpTask: vi.fn(),
      onUpdateCustomerFollowUpTaskStatus,
    });

    fireEvent.click(screen.getByRole("button", { name: "Create task" }));
    expect(
      screen.getByText("Follow-up task title is required."),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Update Call Budi status"), {
      target: { value: "completed" },
    });

    expect(onUpdateCustomerFollowUpTaskStatus).toHaveBeenCalledWith(
      "cust_demo_budi",
      "task_demo",
      "completed",
    );
  });
});
