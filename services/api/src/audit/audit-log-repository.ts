import { randomUUID } from "node:crypto";
import type { InferInsertModel } from "drizzle-orm";
import type { Database } from "../db/client";
import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import { auditLogs } from "../db/schema";
import type { Role } from "../auth/permissions";
import type {
  AuditLogAction,
  AuditLogMetadata,
  AuditLogOutcome,
  AuditLogResourceType,
} from "./audit-log-dto";

type AuditLogInsert = InferInsertModel<typeof auditLogs>;

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
}
