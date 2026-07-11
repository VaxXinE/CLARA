import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type { GmailInboundSyncState } from "./gmail-inbound-sync-state-types";

export type CreateGmailInboundSyncStateInput = GmailInboundSyncState;

export type UpdateGmailInboundSyncStateInput = {
  scope: WorkspaceScope;
  providerAccountId: string;
  lastHistoryId?: string | null;
  lastPageToken?: string | null;
  lastSyncStatus?: GmailInboundSyncState["lastSyncStatus"];
  lastStartedAt?: Date | null;
  lastCompletedAt?: Date | null;
  lastFailedAt?: Date | null;
  lastFailureReasonCode?: GmailInboundSyncState["lastFailureReasonCode"];
  lastFetchedCount?: number;
  lastNormalizedCount?: number;
  lastPersistedCount?: number;
  lastMaterializedCount?: number;
  updatedAt: Date;
};

export interface GmailInboundSyncStateRepository {
  findByProviderAccountScoped(
    scope: WorkspaceScope,
    providerAccountId: string,
  ): Promise<GmailInboundSyncState | null>;
  createState(
    input: CreateGmailInboundSyncStateInput,
  ): Promise<GmailInboundSyncState>;
  updateState(
    input: UpdateGmailInboundSyncStateInput,
  ): Promise<GmailInboundSyncState | null>;
}

export class FixtureGmailInboundSyncStateRepository implements GmailInboundSyncStateRepository {
  private readonly states = new Map<string, GmailInboundSyncState>();

  private getKey(scope: WorkspaceScope, providerAccountId: string): string {
    return `${scope.organizationId}:${scope.workspaceId}:${providerAccountId}`;
  }

  async findByProviderAccountScoped(
    scope: WorkspaceScope,
    providerAccountId: string,
  ): Promise<GmailInboundSyncState | null> {
    return structuredClone(
      this.states.get(this.getKey(scope, providerAccountId)) ?? null,
    );
  }

  async createState(
    input: CreateGmailInboundSyncStateInput,
  ): Promise<GmailInboundSyncState> {
    const key = this.getKey(
      {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      },
      input.providerAccountId,
    );

    this.states.set(key, structuredClone(input));

    return structuredClone(input);
  }

  async updateState(
    input: UpdateGmailInboundSyncStateInput,
  ): Promise<GmailInboundSyncState | null> {
    const key = this.getKey(input.scope, input.providerAccountId);
    const existing = this.states.get(key);

    if (!existing) {
      return null;
    }

    const updated: GmailInboundSyncState = {
      ...existing,
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
    };

    this.states.set(key, updated);

    return structuredClone(updated);
  }
}
