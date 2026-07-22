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

export type CustomerProfileDto = {
  id: string;
  display_name: string;
  contact_identifier: string | null;
  source: string;
  status: string;
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
  type: "customer.created" | "customer.updated" | "customer.note.created";
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

const customerStatuses = ["new", "active", "archived", "blocked"] as const;

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

function toCustomerProfileDto(
  record: CustomerProfileRecord,
): CustomerProfileDto {
  return {
    id: record.id,
    display_name: record.displayName,
    contact_identifier: record.contactIdentifier,
    source: record.source,
    status: record.status,
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

    return {
      data: events.sort((left, right) =>
        right.occurred_at.localeCompare(left.occurred_at),
      ),
      permissions: buildPermissionHints(input.auth.role),
    };
  }
}
