import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { customerFollowUpTasks } from "../db/schema";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type {
  CustomerFollowUpTaskCreateInput,
  CustomerFollowUpTaskRecord,
  CustomerFollowUpTaskRepository,
  CustomerFollowUpTaskStatus,
} from "./customer-follow-up-task-repository";

function toRecord(row: {
  id: string;
  customerId: string;
  title: string;
  body: string | null;
  status: string;
  dueAt: Date | null;
  assigneeUserId: string | null;
  createdByUserId: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): CustomerFollowUpTaskRecord {
  return {
    ...row,
    status: row.status as CustomerFollowUpTaskStatus,
  };
}

export class DrizzleCustomerFollowUpTaskRepository implements CustomerFollowUpTaskRepository {
  constructor(private readonly db: Database) {}

  async listScoped(
    scope: WorkspaceScope,
  ): Promise<CustomerFollowUpTaskRecord[]> {
    const rows = await this.db.query.customerFollowUpTasks.findMany({
      where: and(
        eq(customerFollowUpTasks.organizationId, scope.organizationId),
        eq(customerFollowUpTasks.workspaceId, scope.workspaceId),
      ),
      orderBy: [desc(customerFollowUpTasks.createdAt)],
    });

    return rows.map(toRecord);
  }

  async listForCustomer(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<CustomerFollowUpTaskRecord[]> {
    const rows = await this.db.query.customerFollowUpTasks.findMany({
      where: and(
        eq(customerFollowUpTasks.organizationId, scope.organizationId),
        eq(customerFollowUpTasks.workspaceId, scope.workspaceId),
        eq(customerFollowUpTasks.customerId, customerId),
      ),
      orderBy: [desc(customerFollowUpTasks.createdAt)],
    });

    return rows.map(toRecord);
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    taskId: string,
  ): Promise<CustomerFollowUpTaskRecord | null> {
    const row = await this.db.query.customerFollowUpTasks.findFirst({
      where: and(
        eq(customerFollowUpTasks.id, taskId),
        eq(customerFollowUpTasks.organizationId, scope.organizationId),
        eq(customerFollowUpTasks.workspaceId, scope.workspaceId),
      ),
    });

    return row ? toRecord(row) : null;
  }

  async createForCustomer(
    scope: WorkspaceScope,
    input: CustomerFollowUpTaskCreateInput,
  ): Promise<CustomerFollowUpTaskRecord> {
    const now = new Date();
    const [row] = await this.db
      .insert(customerFollowUpTasks)
      .values({
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
      })
      .returning();

    if (!row) throw new Error("Follow-up task create did not return a row.");
    return toRecord(row);
  }

  async updateScoped(
    scope: WorkspaceScope,
    taskId: string,
    input: {
      status?: CustomerFollowUpTaskStatus;
      completedAt?: Date | null;
    },
  ): Promise<CustomerFollowUpTaskRecord | null> {
    const [row] = await this.db
      .update(customerFollowUpTasks)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(customerFollowUpTasks.id, taskId),
          eq(customerFollowUpTasks.organizationId, scope.organizationId),
          eq(customerFollowUpTasks.workspaceId, scope.workspaceId),
        ),
      )
      .returning();

    return row ? toRecord(row) : null;
  }
}
