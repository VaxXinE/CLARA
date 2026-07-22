import { assertPermission } from "../auth/permissions";
import {
  buildPermissionHints,
  type PermissionHints,
} from "../auth/permission-hints";
import type { AuthContext } from "../auth/auth-context";
import { NotFoundError, ValidationError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { AuditLogService } from "../audit/audit-log-service";
import type {
  CustomerProfileRecord,
  CustomerRepository,
  CustomerWriteInput,
} from "./customer-repository";
import type {
  CustomerNoteRecord,
  CustomerNoteRepository,
} from "./customer-note-repository";
import type { UserRoleManagementRepository } from "../auth/user-role-management-repository";
import {
  customerFollowUpTaskStatuses,
  type CustomerFollowUpTaskRecord,
  type CustomerFollowUpTaskRepository,
  type CustomerFollowUpTaskStatus,
} from "./customer-follow-up-task-repository";

export type CustomerProfileDto = {
  id: string;
  display_name: string;
  contact_identifier: string | null;
  source: string;
  status: string;
  owner_user_id: string | null;
  notes_summary: string | null;
  last_interaction_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CustomerProfileResult = {
  customer: CustomerProfileDto;
  permissions: PermissionHints;
};

export type CustomerListResult = {
  data: CustomerProfileDto[];
  permissions: PermissionHints;
};

export type CustomerMutationResult = CustomerProfileResult & {
  feedback: {
    status: "created" | "updated" | "status_updated" | "owner_assigned";
    message: string;
  };
};

export type CustomerFollowUpTaskDto = {
  id: string;
  customer_id: string;
  title: string;
  body: string | null;
  status: CustomerFollowUpTaskStatus;
  due_at: string | null;
  assignee_user_id: string | null;
  created_by_user_id: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CustomerFollowUpTaskListResult = {
  data: CustomerFollowUpTaskDto[];
  permissions: PermissionHints;
};

export type CustomerFollowUpTaskMutationResult = {
  task: CustomerFollowUpTaskDto;
  permissions: PermissionHints;
  feedback: {
    status: "created" | "updated";
    message: string;
  };
};

export type CustomerNoteDto = {
  id: string;
  customer_id: string;
  author_user_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type CustomerNoteListResult = {
  data: CustomerNoteDto[];
  permissions: PermissionHints;
};

export type CustomerNoteMutationResult = {
  note: CustomerNoteDto;
  permissions: PermissionHints;
  feedback: {
    status: "created";
    message: string;
  };
};

export type CustomerActivityTimelineEventDto = {
  id: string;
  type:
    | "customer.created"
    | "customer.updated"
    | "customer.note.created"
    | "customer.status.updated"
    | "customer.owner.assigned"
    | "customer.owner.reassigned"
    | "customer.follow_up_task.created"
    | "customer.follow_up_task.updated"
    | "customer.follow_up_task.completed"
    | "customer.follow_up_task.cancelled";
  title: string;
  summary: string;
  customer_id: string;
  actor_user_id: string | null;
  occurred_at: string;
};

export type CustomerActivityTimelineResult = {
  data: CustomerActivityTimelineEventDto[];
  permissions: PermissionHints;
};

const customerSources = [
  "demo",
  "whatsapp_demo",
  "whatsapp",
  "web_chat_demo",
  "email",
  "webchat",
  "extension_bridge",
] as const;

const customerStatuses = [
  "new",
  "active",
  "follow_up",
  "at_risk",
  "resolved",
  "archived",
  "blocked",
] as const;
const lifecycleStatuses = customerStatuses;

export type CustomerMutationInput = {
  displayName?: string | undefined;
  contactIdentifier?: string | null | undefined;
  source?: string | undefined;
  status?: string | undefined;
  notesSummary?: string | null | undefined;
};

export type CustomerNoteInput = {
  body: string;
};

export type CustomerFollowUpTaskCreateInput = {
  title: string;
  body?: string | null | undefined;
  dueAt?: string | null | undefined;
  assigneeUserId?: string | null | undefined;
};

export type CustomerFollowUpTaskUpdateInput = {
  status: CustomerFollowUpTaskStatus;
};

function toCustomerProfileDto(
  record: CustomerProfileRecord,
): CustomerProfileDto {
  return {
    id: record.id,
    display_name: record.displayName,
    contact_identifier: record.contactIdentifier,
    source: record.source,
    status: record.status,
    owner_user_id: record.ownerUserId,
    notes_summary: record.notesSummary,
    last_interaction_at: record.lastInteractionAt?.toISOString() ?? null,
    created_at: record.createdAt.toISOString(),
    updated_at: record.updatedAt.toISOString(),
  };
}

function toCustomerNoteDto(record: CustomerNoteRecord): CustomerNoteDto {
  return {
    id: record.id,
    customer_id: record.customerId,
    author_user_id: record.authorUserId,
    body: record.body,
    created_at: record.createdAt.toISOString(),
    updated_at: record.updatedAt.toISOString(),
  };
}

function toCustomerFollowUpTaskDto(
  record: CustomerFollowUpTaskRecord,
): CustomerFollowUpTaskDto {
  return {
    id: record.id,
    customer_id: record.customerId,
    title: record.title,
    body: record.body,
    status: record.status,
    due_at: record.dueAt?.toISOString() ?? null,
    assignee_user_id: record.assigneeUserId,
    created_by_user_id: record.createdByUserId,
    completed_at: record.completedAt?.toISOString() ?? null,
    created_at: record.createdAt.toISOString(),
    updated_at: record.updatedAt.toISOString(),
  };
}

function normalizeNullableText(value: string | null | undefined) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeDisplayName(value: string | undefined) {
  const trimmed = value?.trim() ?? "";

  if (trimmed.length === 0) {
    throw new ValidationError("Invalid customer input.", [
      { path: "body.displayName", message: "Display name is required." },
    ]);
  }

  return trimmed;
}

function normalizeTaskBody(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const body = value.trim();
  if (body.length === 0) return null;
  if (body.length > 2000) {
    throw new ValidationError("Invalid follow-up task input.", [
      { path: "body.body", message: "Task body is too long." },
    ]);
  }
  return body;
}

function normalizeTaskDueAt(value: string | null | undefined): Date | null {
  if (value === undefined || value === null || value.trim().length === 0) {
    return null;
  }

  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
  const dueAt = new Date(dateOnly ? `${value.trim()}T00:00:00.000Z` : value);

  if (Number.isNaN(dueAt.getTime())) {
    throw new ValidationError("Invalid follow-up task input.", [
      { path: "body.dueAt", message: "Due date must be a valid date." },
    ]);
  }

  if (dueAt.getUTCFullYear() < 2000 || dueAt.getUTCFullYear() > 2100) {
    throw new ValidationError("Invalid follow-up task input.", [
      { path: "body.dueAt", message: "Due date is outside the safe range." },
    ]);
  }

  return dueAt;
}

function taskAuditAction(status: CustomerFollowUpTaskStatus) {
  if (status === "completed") return "customer.follow_up_task.completed";
  if (status === "cancelled") return "customer.follow_up_task.cancelled";
  return "customer.follow_up_task.updated";
}

function normalizeCustomerInput(
  input: CustomerMutationInput,
  options: { requireDisplayName: boolean },
): Partial<CustomerWriteInput> {
  const normalized: Partial<CustomerWriteInput> = {};

  if (options.requireDisplayName || input.displayName !== undefined) {
    normalized.displayName = normalizeDisplayName(input.displayName);
  }

  if (input.contactIdentifier !== undefined) {
    const contactIdentifier = normalizeNullableText(input.contactIdentifier);

    if (contactIdentifier !== undefined) {
      normalized.contactIdentifier = contactIdentifier;
    }
  }

  if (input.notesSummary !== undefined) {
    const notesSummary = normalizeNullableText(input.notesSummary);

    if (notesSummary !== undefined) {
      normalized.notesSummary = notesSummary;
    }
  }

  if (input.source !== undefined) {
    if (
      !customerSources.includes(
        input.source as (typeof customerSources)[number],
      )
    ) {
      throw new ValidationError("Invalid customer input.", [
        { path: "body.source", message: "Unsupported customer source." },
      ]);
    }
    normalized.source = input.source;
  }

  if (input.status !== undefined) {
    if (
      !customerStatuses.includes(
        input.status as (typeof customerStatuses)[number],
      )
    ) {
      throw new ValidationError("Invalid customer input.", [
        { path: "body.status", message: "Unsupported customer status." },
      ]);
    }
    normalized.status = input.status;
  }

  return normalized;
}

export class CustomerQueryService {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly auditLogs?: AuditLogService,
    private readonly notes?: CustomerNoteRepository,
    private readonly members?: UserRoleManagementRepository,
    private readonly followUpTasks?: CustomerFollowUpTaskRepository,
  ) {}

  async listCustomers(input: {
    auth: AuthContext;
    search?: string | undefined;
    status?: string | undefined;
  }): Promise<CustomerListResult> {
    assertPermission(input.auth.role, "customer:read");

    const search = input.search?.trim().toLowerCase();
    const rows = await this.repository.listScoped(
      getWorkspaceScopeFromAuth(input.auth),
    );

    const filtered = rows.filter((customer) => {
      if (input.status && customer.status !== input.status) return false;
      if (!search) return true;

      return [
        customer.displayName,
        customer.contactIdentifier,
        customer.source,
        customer.status,
        customer.notesSummary,
      ].some((value) => value?.toLowerCase().includes(search));
    });

    return {
      data: filtered.map(toCustomerProfileDto),
      permissions: buildPermissionHints(input.auth.role),
    };
  }

  async getCustomerProfile(input: {
    auth: AuthContext;
    customerId: string;
  }): Promise<CustomerProfileResult> {
    assertPermission(input.auth.role, "customer:read");

    const record = await this.repository.findByIdScoped(
      getWorkspaceScopeFromAuth(input.auth),
      input.customerId,
    );

    if (!record) {
      throw new NotFoundError("Customer not found.");
    }

    return {
      customer: toCustomerProfileDto(record),
      permissions: buildPermissionHints(input.auth.role),
    };
  }

  async createCustomer(input: {
    auth: AuthContext;
    payload: CustomerMutationInput;
    correlationId: string;
  }): Promise<CustomerMutationResult> {
    assertPermission(input.auth.role, "customer:create");
    const normalized = normalizeCustomerInput(input.payload, {
      requireDisplayName: true,
    });

    const record = await this.repository.createScoped(
      getWorkspaceScopeFromAuth(input.auth),
      {
        displayName: normalized.displayName ?? "",
        contactIdentifier: normalized.contactIdentifier ?? null,
        source: normalized.source ?? "demo",
        status: normalized.status ?? "new",
        ownerUserId: null,
        notesSummary: normalized.notesSummary ?? null,
      },
    );

    await this.auditLogs?.recordCustomerMutation({
      auth: input.auth,
      correlationId: input.correlationId,
      action: "customer.created",
      customerId: record.id,
      status: record.status,
      changedFields: Object.keys(normalized),
    });

    return {
      customer: toCustomerProfileDto(record),
      permissions: buildPermissionHints(input.auth.role),
      feedback: {
        status: "created",
        message: "Customer created.",
      },
    };
  }

  async updateCustomerLifecycleStatus(input: {
    auth: AuthContext;
    customerId: string;
    payload: { status: string };
    correlationId: string;
  }): Promise<CustomerMutationResult> {
    assertPermission(input.auth.role, "customer:update");

    if (
      !lifecycleStatuses.includes(
        input.payload.status as (typeof lifecycleStatuses)[number],
      )
    ) {
      throw new ValidationError("Invalid customer lifecycle input.", [
        { path: "body.status", message: "Unsupported customer status." },
      ]);
    }

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const previous = await this.repository.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!previous) {
      throw new NotFoundError("Customer not found.");
    }

    const record = await this.repository.updateScoped(scope, input.customerId, {
      status: input.payload.status,
    });

    if (!record) {
      throw new NotFoundError("Customer not found.");
    }

    await this.auditLogs?.recordCustomerStatusUpdated({
      auth: input.auth,
      correlationId: input.correlationId,
      customerId: record.id,
      previousStatus: previous.status,
      nextStatus: record.status,
    });

    return {
      customer: toCustomerProfileDto(record),
      permissions: buildPermissionHints(input.auth.role),
      feedback: {
        status: "status_updated",
        message: "Customer lifecycle status updated.",
      },
    };
  }

  async assignCustomerOwner(input: {
    auth: AuthContext;
    customerId: string;
    payload: { ownerUserId: string };
    correlationId: string;
  }): Promise<CustomerMutationResult> {
    assertPermission(input.auth.role, "customer:update");

    if (!this.members) {
      throw new ValidationError("Workspace member lookup is not configured.");
    }

    const ownerUserId = input.payload.ownerUserId.trim();

    if (ownerUserId.length === 0) {
      throw new ValidationError("Invalid customer owner input.", [
        { path: "body.ownerUserId", message: "Owner user id is required." },
      ]);
    }

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const previous = await this.repository.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!previous) {
      throw new NotFoundError("Customer not found.");
    }

    const member = (await this.members.listWorkspaceMembers(scope)).find(
      (candidate) =>
        candidate.userId === ownerUserId && candidate.status === "active",
    );

    if (!member) {
      throw new ValidationError("Invalid customer owner input.", [
        {
          path: "body.ownerUserId",
          message: "Owner must be an active workspace member.",
        },
      ]);
    }

    const record = await this.repository.updateScoped(scope, input.customerId, {
      ownerUserId,
    });

    if (!record) {
      throw new NotFoundError("Customer not found.");
    }

    await this.auditLogs?.recordCustomerOwnerChanged({
      auth: input.auth,
      correlationId: input.correlationId,
      customerId: record.id,
      previousOwnerUserId: previous.ownerUserId,
      nextOwnerUserId: record.ownerUserId ?? ownerUserId,
    });

    return {
      customer: toCustomerProfileDto(record),
      permissions: buildPermissionHints(input.auth.role),
      feedback: {
        status: "owner_assigned",
        message: previous.ownerUserId
          ? "Customer owner reassigned."
          : "Customer owner assigned.",
      },
    };
  }

  async updateCustomer(input: {
    auth: AuthContext;
    customerId: string;
    payload: CustomerMutationInput;
    correlationId: string;
  }): Promise<CustomerMutationResult> {
    assertPermission(input.auth.role, "customer:update");
    const normalized = normalizeCustomerInput(input.payload, {
      requireDisplayName: false,
    });

    if (Object.keys(normalized).length === 0) {
      throw new ValidationError("Invalid customer input.", [
        {
          path: "body",
          message: "At least one safe customer field is required.",
        },
      ]);
    }

    const record = await this.repository.updateScoped(
      getWorkspaceScopeFromAuth(input.auth),
      input.customerId,
      normalized,
    );

    if (!record) {
      throw new NotFoundError("Customer not found.");
    }

    await this.auditLogs?.recordCustomerMutation({
      auth: input.auth,
      correlationId: input.correlationId,
      action: "customer.updated",
      customerId: record.id,
      status: record.status,
      changedFields: Object.keys(normalized),
    });

    return {
      customer: toCustomerProfileDto(record),
      permissions: buildPermissionHints(input.auth.role),
      feedback: {
        status: "updated",
        message: "Customer updated.",
      },
    };
  }

  async listCustomerNotes(input: {
    auth: AuthContext;
    customerId: string;
  }): Promise<CustomerNoteListResult> {
    assertPermission(input.auth.role, "customer:read");
    const scope = getWorkspaceScopeFromAuth(input.auth);
    const customer = await this.repository.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!customer) {
      throw new NotFoundError("Customer not found.");
    }

    const notes = await this.notes?.listForCustomer(scope, input.customerId);

    return {
      data: (notes ?? []).map(toCustomerNoteDto),
      permissions: buildPermissionHints(input.auth.role),
    };
  }

  async createCustomerNote(input: {
    auth: AuthContext;
    customerId: string;
    payload: CustomerNoteInput;
    correlationId: string;
  }): Promise<CustomerNoteMutationResult> {
    assertPermission(input.auth.role, "customer:update");

    if (!this.notes) {
      throw new ValidationError("Customer notes are not configured.");
    }

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const customer = await this.repository.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!customer) {
      throw new NotFoundError("Customer not found.");
    }

    const body = input.payload.body.trim();

    if (body.length === 0) {
      throw new ValidationError("Invalid customer note input.", [
        { path: "body.body", message: "Note body is required." },
      ]);
    }

    if (body.length > 2000) {
      throw new ValidationError("Invalid customer note input.", [
        { path: "body.body", message: "Note body is too long." },
      ]);
    }

    const note = await this.notes.createForCustomer(scope, {
      customerId: input.customerId,
      authorUserId: input.auth.userId,
      body,
    });

    await this.auditLogs?.recordCustomerNoteCreated({
      auth: input.auth,
      correlationId: input.correlationId,
      customerId: input.customerId,
      noteId: note.id,
      bodyLength: body.length,
    });

    return {
      note: toCustomerNoteDto(note),
      permissions: buildPermissionHints(input.auth.role),
      feedback: {
        status: "created",
        message: "Customer note added.",
      },
    };
  }

  async listCustomerFollowUpTasks(input: {
    auth: AuthContext;
    customerId: string;
  }): Promise<CustomerFollowUpTaskListResult> {
    assertPermission(input.auth.role, "customer:read");

    if (!this.followUpTasks) {
      throw new ValidationError("Follow-up tasks are not configured.");
    }

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const customer = await this.repository.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!customer) throw new NotFoundError("Customer not found.");

    return {
      data: (
        await this.followUpTasks.listForCustomer(scope, input.customerId)
      ).map(toCustomerFollowUpTaskDto),
      permissions: buildPermissionHints(input.auth.role),
    };
  }

  async createCustomerFollowUpTask(input: {
    auth: AuthContext;
    customerId: string;
    payload: CustomerFollowUpTaskCreateInput;
    correlationId: string;
  }): Promise<CustomerFollowUpTaskMutationResult> {
    assertPermission(input.auth.role, "customer:update");

    if (!this.followUpTasks || !this.members) {
      throw new ValidationError("Follow-up tasks are not configured.");
    }

    const title = input.payload.title.trim();

    if (title.length === 0) {
      throw new ValidationError("Invalid follow-up task input.", [
        { path: "body.title", message: "Task title is required." },
      ]);
    }

    if (title.length > 160) {
      throw new ValidationError("Invalid follow-up task input.", [
        { path: "body.title", message: "Task title is too long." },
      ]);
    }

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const customer = await this.repository.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!customer) throw new NotFoundError("Customer not found.");

    const assigneeUserId =
      normalizeNullableText(input.payload.assigneeUserId) ?? null;

    if (assigneeUserId) {
      const member = (await this.members.listWorkspaceMembers(scope)).find(
        (candidate) =>
          candidate.userId === assigneeUserId && candidate.status === "active",
      );

      if (!member) {
        throw new ValidationError("Invalid follow-up task input.", [
          {
            path: "body.assigneeUserId",
            message: "Task assignee must be an active workspace member.",
          },
        ]);
      }
    }

    const task = await this.followUpTasks.createForCustomer(scope, {
      customerId: input.customerId,
      title,
      body: normalizeTaskBody(input.payload.body),
      dueAt: normalizeTaskDueAt(input.payload.dueAt),
      assigneeUserId,
      createdByUserId: input.auth.userId,
    });

    await this.auditLogs?.recordCustomerFollowUpTaskChanged({
      auth: input.auth,
      correlationId: input.correlationId,
      action: "customer.follow_up_task.created",
      customerId: input.customerId,
      taskId: task.id,
      status: task.status,
      assigneeUserId: task.assigneeUserId,
      dueAt: task.dueAt,
    });

    return {
      task: toCustomerFollowUpTaskDto(task),
      permissions: buildPermissionHints(input.auth.role),
      feedback: {
        status: "created",
        message: "Follow-up task created.",
      },
    };
  }

  async updateCustomerFollowUpTask(input: {
    auth: AuthContext;
    customerId: string;
    taskId: string;
    payload: CustomerFollowUpTaskUpdateInput;
    correlationId: string;
  }): Promise<CustomerFollowUpTaskMutationResult> {
    assertPermission(input.auth.role, "customer:update");

    if (!this.followUpTasks) {
      throw new ValidationError("Follow-up tasks are not configured.");
    }

    if (!customerFollowUpTaskStatuses.includes(input.payload.status)) {
      throw new ValidationError("Invalid follow-up task input.", [
        { path: "body.status", message: "Unsupported follow-up task status." },
      ]);
    }

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const customer = await this.repository.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!customer) throw new NotFoundError("Customer not found.");

    const previous = await this.followUpTasks.findByIdScoped(
      scope,
      input.taskId,
    );

    if (!previous || previous.customerId !== input.customerId) {
      throw new NotFoundError("Follow-up task not found.");
    }

    const completedAt =
      input.payload.status === "completed" ? new Date() : null;
    const task = await this.followUpTasks.updateScoped(scope, input.taskId, {
      status: input.payload.status,
      completedAt,
    });

    if (!task) throw new NotFoundError("Follow-up task not found.");

    await this.auditLogs?.recordCustomerFollowUpTaskChanged({
      auth: input.auth,
      correlationId: input.correlationId,
      action: taskAuditAction(task.status),
      customerId: input.customerId,
      taskId: task.id,
      status: task.status,
      assigneeUserId: task.assigneeUserId,
      dueAt: task.dueAt,
    });

    return {
      task: toCustomerFollowUpTaskDto(task),
      permissions: buildPermissionHints(input.auth.role),
      feedback: {
        status: "updated",
        message: "Follow-up task updated.",
      },
    };
  }

  async listCustomerActivityTimeline(input: {
    auth: AuthContext;
    customerId: string;
  }): Promise<CustomerActivityTimelineResult> {
    assertPermission(input.auth.role, "customer:read");
    const scope = getWorkspaceScopeFromAuth(input.auth);
    const customer = await this.repository.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!customer) {
      throw new NotFoundError("Customer not found.");
    }

    const notes = await this.notes?.listForCustomer(scope, input.customerId);
    const tasks = await this.followUpTasks?.listForCustomer(
      scope,
      input.customerId,
    );
    const events: CustomerActivityTimelineEventDto[] = [
      {
        id: `${customer.id}:created`,
        type: "customer.created",
        title: "Customer created",
        summary: "Customer profile was created.",
        customer_id: customer.id,
        actor_user_id: null,
        occurred_at: customer.createdAt.toISOString(),
      },
    ];

    if (customer.updatedAt.getTime() !== customer.createdAt.getTime()) {
      events.push({
        id: `${customer.id}:updated`,
        type: "customer.updated",
        title: "Customer updated",
        summary: "Customer profile was updated.",
        customer_id: customer.id,
        actor_user_id: null,
        occurred_at: customer.updatedAt.toISOString(),
      });

      events.push({
        id: `${customer.id}:status:${customer.updatedAt.toISOString()}`,
        type: "customer.status.updated",
        title: "Lifecycle status updated",
        summary: `Customer lifecycle status is ${customer.status}.`,
        customer_id: customer.id,
        actor_user_id: null,
        occurred_at: customer.updatedAt.toISOString(),
      });

      if (customer.ownerUserId) {
        events.push({
          id: `${customer.id}:owner:${customer.updatedAt.toISOString()}`,
          type: "customer.owner.assigned",
          title: "Customer owner assigned",
          summary: "Customer owner assignment was updated.",
          customer_id: customer.id,
          actor_user_id: customer.ownerUserId,
          occurred_at: customer.updatedAt.toISOString(),
        });
      }
    }

    for (const note of notes ?? []) {
      events.push({
        id: note.id,
        type: "customer.note.created",
        title: "Internal note added",
        summary: "A workspace operator added an internal customer note.",
        customer_id: note.customerId,
        actor_user_id: note.authorUserId,
        occurred_at: note.createdAt.toISOString(),
      });
    }

    for (const task of tasks ?? []) {
      const type =
        task.status === "completed"
          ? "customer.follow_up_task.completed"
          : task.status === "cancelled"
            ? "customer.follow_up_task.cancelled"
            : "customer.follow_up_task.created";

      events.push({
        id: `${task.id}:${task.status}`,
        type,
        title:
          task.status === "completed"
            ? "Follow-up task completed"
            : task.status === "cancelled"
              ? "Follow-up task cancelled"
              : "Follow-up task created",
        summary: `Follow-up task: ${task.title}.`,
        customer_id: task.customerId,
        actor_user_id: task.assigneeUserId ?? task.createdByUserId,
        occurred_at: task.updatedAt.toISOString(),
      });
    }

    return {
      data: events.sort((left, right) =>
        right.occurred_at.localeCompare(left.occurred_at),
      ),
      permissions: buildPermissionHints(input.auth.role),
    };
  }
}
