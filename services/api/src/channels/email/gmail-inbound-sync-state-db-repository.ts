import { and, eq } from "drizzle-orm";
import type { Database } from "../../db/client";
import { gmailInboundSyncStates } from "../../db/schema";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type {
  CreateGmailInboundSyncStateInput,
  GmailInboundSyncStateRepository,
  UpdateGmailInboundSyncStateInput,
} from "./gmail-inbound-sync-state-repository";
import type { GmailInboundSyncState } from "./gmail-inbound-sync-state-types";

function requireDate(
  value: Date | null | undefined,
  field: string,
): Date | null {
  if (value === undefined) {
    throw new Error(
      `Gmail inbound sync state row is missing date field: ${field}`,
    );
  }

  return value ?? null;
}

function toState(row: {
  id: string;
  organizationId: string;
  workspaceId: string;
  providerAccountId: string;
  provider: string;
  lastHistoryId: string | null;
  lastPageToken: string | null;
  lastSyncStatus: string;
  lastStartedAt: Date | null;
  lastCompletedAt: Date | null;
  lastFailedAt: Date | null;
  lastFailureReasonCode: string | null;
  lastFetchedCount: number;
  lastNormalizedCount: number;
  lastPersistedCount: number;
  lastMaterializedCount: number;
  createdAt: Date;
  updatedAt: Date;
}): GmailInboundSyncState {
  return {
    id: row.id,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    providerAccountId: row.providerAccountId,
    provider: "gmail",
    lastHistoryId: row.lastHistoryId ?? null,
    lastPageToken: row.lastPageToken ?? null,
    lastSyncStatus:
      row.lastSyncStatus as GmailInboundSyncState["lastSyncStatus"],
    lastStartedAt: requireDate(
      row.lastStartedAt,
      "gmail_inbound_sync_states.lastStartedAt",
    ),
    lastCompletedAt: requireDate(
      row.lastCompletedAt,
      "gmail_inbound_sync_states.lastCompletedAt",
    ),
    lastFailedAt: requireDate(
      row.lastFailedAt,
      "gmail_inbound_sync_states.lastFailedAt",
    ),
    lastFailureReasonCode:
      (row.lastFailureReasonCode as GmailInboundSyncState["lastFailureReasonCode"]) ??
      null,
    lastFetchedCount: row.lastFetchedCount,
    lastNormalizedCount: row.lastNormalizedCount,
    lastPersistedCount: row.lastPersistedCount,
    lastMaterializedCount: row.lastMaterializedCount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function findScopedByProviderAccount(
  db: Database,
  scope: WorkspaceScope,
  providerAccountId: string,
): Promise<GmailInboundSyncState | null> {
  const row = await db.query.gmailInboundSyncStates.findFirst({
    where: and(
      eq(gmailInboundSyncStates.organizationId, scope.organizationId),
      eq(gmailInboundSyncStates.workspaceId, scope.workspaceId),
      eq(gmailInboundSyncStates.providerAccountId, providerAccountId),
    ),
  });

  return row ? toState(row) : null;
}

export class DrizzleGmailInboundSyncStateRepository implements GmailInboundSyncStateRepository {
  constructor(private readonly db: Database) {}

  async findByProviderAccountScoped(
    scope: WorkspaceScope,
    providerAccountId: string,
  ): Promise<GmailInboundSyncState | null> {
    return findScopedByProviderAccount(this.db, scope, providerAccountId);
  }

  async createState(
    input: CreateGmailInboundSyncStateInput,
  ): Promise<GmailInboundSyncState> {
    await this.db.insert(gmailInboundSyncStates).values({
      id: input.id,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      providerAccountId: input.providerAccountId,
      provider: input.provider,
      lastHistoryId: input.lastHistoryId,
      lastPageToken: input.lastPageToken,
      lastSyncStatus: input.lastSyncStatus,
      lastStartedAt: input.lastStartedAt,
      lastCompletedAt: input.lastCompletedAt,
      lastFailedAt: input.lastFailedAt,
      lastFailureReasonCode: input.lastFailureReasonCode,
      lastFetchedCount: input.lastFetchedCount,
      lastNormalizedCount: input.lastNormalizedCount,
      lastPersistedCount: input.lastPersistedCount,
      lastMaterializedCount: input.lastMaterializedCount,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });

    return input;
  }

  async updateState(
    input: UpdateGmailInboundSyncStateInput,
  ): Promise<GmailInboundSyncState | null> {
    const existing = await findScopedByProviderAccount(
      this.db,
      input.scope,
      input.providerAccountId,
    );

    if (!existing) {
      return null;
    }

    await this.db
      .update(gmailInboundSyncStates)
      .set({
        lastHistoryId:
          input.lastHistoryId === undefined
            ? existing.lastHistoryId
            : input.lastHistoryId,
        lastPageToken:
          input.lastPageToken === undefined
            ? existing.lastPageToken
            : input.lastPageToken,
        lastSyncStatus: input.lastSyncStatus ?? existing.lastSyncStatus,
        lastStartedAt:
          input.lastStartedAt === undefined
            ? existing.lastStartedAt
            : input.lastStartedAt,
        lastCompletedAt:
          input.lastCompletedAt === undefined
            ? existing.lastCompletedAt
            : input.lastCompletedAt,
        lastFailedAt:
          input.lastFailedAt === undefined
            ? existing.lastFailedAt
            : input.lastFailedAt,
        lastFailureReasonCode:
          input.lastFailureReasonCode === undefined
            ? existing.lastFailureReasonCode
            : input.lastFailureReasonCode,
        lastFetchedCount:
          input.lastFetchedCount === undefined
            ? existing.lastFetchedCount
            : input.lastFetchedCount,
        lastNormalizedCount:
          input.lastNormalizedCount === undefined
            ? existing.lastNormalizedCount
            : input.lastNormalizedCount,
        lastPersistedCount:
          input.lastPersistedCount === undefined
            ? existing.lastPersistedCount
            : input.lastPersistedCount,
        lastMaterializedCount:
          input.lastMaterializedCount === undefined
            ? existing.lastMaterializedCount
            : input.lastMaterializedCount,
        updatedAt: input.updatedAt,
      })
      .where(
        and(
          eq(gmailInboundSyncStates.organizationId, input.scope.organizationId),
          eq(gmailInboundSyncStates.workspaceId, input.scope.workspaceId),
          eq(gmailInboundSyncStates.providerAccountId, input.providerAccountId),
        ),
      );

    return findScopedByProviderAccount(
      this.db,
      input.scope,
      input.providerAccountId,
    );
  }
}
