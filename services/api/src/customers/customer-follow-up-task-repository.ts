import { randomUUID } from "node:crypto";
import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import type { WorkspaceScope } from "../workspace/workspace-scope";

export const customerFollowUpTaskStatuses = [
  "open",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type CustomerFollowUpTaskStatus =
  (typeof customerFollowUpTaskStatuses)[number];

export type CustomerFollowUpTaskRecord = {
  id: string;
  customerId: string;
  title: string;
  body: string | null;
  status: CustomerFollowUpTaskStatus;
  dueAt: Date | null;
  assigneeUserId: string | null;
  createdByUserId: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerFollowUpTaskCreateInput = {
  customerId: string;
  title: string;
  body: string | null;
  dueAt: Date | null;
  assigneeUserId: string | null;
  createdByUserId: string;
};

export interface CustomerFollowUpTaskRepository {
  listForCustomer(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<CustomerFollowUpTaskRecord[]>;
  findByIdScoped(
    scope: WorkspaceScope,
    taskId: string,
  ): Promise<CustomerFollowUpTaskRecord | null>;
  createForCustomer(
    scope: WorkspaceScope,
    input: CustomerFollowUpTaskCreateInput,
  ): Promise<CustomerFollowUpTaskRecord>;
  updateScoped(
    scope: WorkspaceScope,
    taskId: string,
    input: {
      status?: CustomerFollowUpTaskStatus;
      completedAt?: Date | null;
    },
  ): Promise<CustomerFollowUpTaskRecord | null>;
}

function requireDate(value: Date | undefined, field: string): Date {
  if (!value)
    throw new Error(`Fixture is missing required date field: ${field}`);
  return value;
}

function toRecord(row: {
  id: string;
  customerId: string;
  title: string;
  body?: string | null | undefined;
  status?: string | undefined;
  dueAt?: Date | null | undefined;
  assigneeUserId?: string | null | undefined;
  createdByUserId: string;
  completedAt?: Date | null | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}): CustomerFollowUpTaskRecord {
  return {
    id: row.id,
    customerId: row.customerId,
    title: row.title,
    body: row.body ?? null,
    status: (row.status ?? "open") as CustomerFollowUpTaskStatus,
    dueAt: row.dueAt ?? null,
    assigneeUserId: row.assigneeUserId ?? null,
    createdByUserId: row.createdByUserId,
    completedAt: row.completedAt ?? null,
    createdAt: requireDate(row.createdAt, "customerFollowUpTask.createdAt"),
    updatedAt: requireDate(row.updatedAt, "customerFollowUpTask.updatedAt"),
  };
}

export class FixtureCustomerFollowUpTaskRepository implements CustomerFollowUpTaskRepository {
  constructor(
    private readonly store: FixtureAppStore = createFixtureAppStore(),
  ) {}

  async listForCustomer(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<CustomerFollowUpTaskRecord[]> {
    return this.store.customerFollowUpTasks
      .filter(
        (task) =>
          task.organizationId === scope.organizationId &&
          task.workspaceId === scope.workspaceId &&
          task.customerId === customerId,
      )
      .sort((left, right) => {
        return (
          requireDate(
            right.createdAt,
            "customerFollowUpTask.createdAt",
          ).getTime() -
          requireDate(
            left.createdAt,
            "customerFollowUpTask.createdAt",
          ).getTime()
        );
      })
      .map(toRecord);
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    taskId: string,
  ): Promise<CustomerFollowUpTaskRecord | null> {
    const task =
      this.store.customerFollowUpTasks.find(
        (candidate) =>
          candidate.id === taskId &&
          candidate.organizationId === scope.organizationId &&
          candidate.workspaceId === scope.workspaceId,
      ) ?? null;

    return task ? toRecord(task) : null;
  }

  async createForCustomer(
    scope: WorkspaceScope,
    input: CustomerFollowUpTaskCreateInput,
  ): Promise<CustomerFollowUpTaskRecord> {
    const now = new Date();
    const task = {
      id: `task_${randomUUID()}`,
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      customerId: input.customerId,
      title: input.title,
      body: input.body,
      status: "open",
      dueAt: input.dueAt,
      assigneeUserId: input.assigneeUserId,
      createdByUserId: input.createdByUserId,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    this.store.customerFollowUpTasks.push(task);
    return toRecord(task);
  }

  async updateScoped(
    scope: WorkspaceScope,
    taskId: string,
    input: { status?: CustomerFollowUpTaskStatus; completedAt?: Date | null },
  ): Promise<CustomerFollowUpTaskRecord | null> {
    const task = this.store.customerFollowUpTasks.find(
      (candidate) =>
        candidate.id === taskId &&
        candidate.organizationId === scope.organizationId &&
        candidate.workspaceId === scope.workspaceId,
    );

    if (!task) return null;
    if (input.status !== undefined) task.status = input.status;
    if (input.completedAt !== undefined) task.completedAt = input.completedAt;
    task.updatedAt = new Date();

    return toRecord(task);
  }
}
