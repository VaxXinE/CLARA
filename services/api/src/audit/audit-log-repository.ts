import { randomUUID } from "node:crypto";
import { and, desc, eq, type InferInsertModel } from "drizzle-orm";
import type { Database } from "../db/client";
import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import { auditLogs } from "../db/schema";
import type { Role } from "../auth/permissions";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type {
  AuditLogAction,
  AuditLogMetadata,
  AuditLogOutcome,
  AuditLogResourceType,
} from "./audit-log-dto";

type AuditLogInsert = InferInsertModel<typeof auditLogs>;

export type AuditLogRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  actorUserId: string;
  actorRole: Role;
  action: AuditLogAction;
  resourceType: AuditLogResourceType;
  resourceId: string;
  outcome: AuditLogOutcome;
  correlationId: string;
  createdAt: Date;
};

export type CreateAuditLogInput = {
  organizationId: string;
  workspaceId: string;
  actorUserId: string;
  actorRole: Role;
  action: AuditLogAction;
  resourceType: AuditLogResourceType;
  resourceId: string;
  outcome: AuditLogOutcome;
  metadata?: AuditLogMetadata | null;
  correlationId: string;
};

export interface AuditLogRepository {
  create(input: CreateAuditLogInput): Promise<void>;
  listRecentScoped?(
    scope: WorkspaceScope,
    limit: number,
  ): Promise<AuditLogRecord[]>;
}

function createAuditLogId(): string {
  return `audit_${randomUUID()}`;
}

function normalizeMetadata(
  metadata: AuditLogMetadata | null | undefined,
): AuditLogMetadata | null {
  if (!metadata) {
    return null;
  }

  const normalized = Object.fromEntries(
    Object.entries(metadata).filter(([, value]) => value !== undefined),
  ) as AuditLogMetadata;

  return Object.keys(normalized).length > 0 ? normalized : null;
}

function buildAuditLogRow(
  input: CreateAuditLogInput,
  id: string,
  createdAt: Date,
): AuditLogInsert {
  return {
    id,
    organizationId: input.organizationId,
    workspaceId: input.workspaceId,
    actorUserId: input.actorUserId,
    actorRole: input.actorRole,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    outcome: input.outcome,
    metadataJson: normalizeMetadata(input.metadata),
    correlationId: input.correlationId,
    createdAt,
  };
}

export class FixtureAuditLogRepository implements AuditLogRepository {
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async create(input: CreateAuditLogInput): Promise<void> {
    this.store.auditLogs.push(
      buildAuditLogRow(input, createAuditLogId(), new Date()),
    );
  }

  async listRecentScoped(
    scope: WorkspaceScope,
    limit: number,
  ): Promise<AuditLogRecord[]> {
    return this.store.auditLogs
      .filter(
        (log) =>
          log.organizationId === scope.organizationId &&
          log.workspaceId === scope.workspaceId,
      )
      .sort(
        (left, right) =>
          requireDate(right.createdAt).getTime() -
          requireDate(left.createdAt).getTime(),
      )
      .slice(0, limit)
      .map(toAuditLogRecord);
  }

  getState(): FixtureAppStore {
    return structuredClone(this.store);
  }
}

export class DrizzleAuditLogRepository implements AuditLogRepository {
  constructor(private readonly db: Database) {}

  async create(input: CreateAuditLogInput): Promise<void> {
    await this.db
      .insert(auditLogs)
      .values(buildAuditLogRow(input, createAuditLogId(), new Date()));
  }

  async listRecentScoped(
    scope: WorkspaceScope,
    limit: number,
  ): Promise<AuditLogRecord[]> {
    const rows = await this.db.query.auditLogs.findMany({
      where: and(
        eq(auditLogs.organizationId, scope.organizationId),
        eq(auditLogs.workspaceId, scope.workspaceId),
      ),
      orderBy: [desc(auditLogs.createdAt)],
      limit,
    });

    return rows.map(toAuditLogRecord);
  }
}

function toAuditLogRecord(row: AuditLogInsert): AuditLogRecord {
  return {
    id: row.id,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    actorUserId: row.actorUserId,
    actorRole: row.actorRole as Role,
    action: row.action as AuditLogAction,
    resourceType: row.resourceType as AuditLogResourceType,
    resourceId: row.resourceId,
    outcome: row.outcome as AuditLogOutcome,
    correlationId: row.correlationId,
    createdAt: requireDate(row.createdAt),
  };
}

function requireDate(value: Date | undefined): Date {
  if (!value) {
    throw new Error("Audit log row is missing createdAt.");
  }

  return value;
}
