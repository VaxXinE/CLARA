import type { WorkspaceScope } from "../../workspace/workspace-scope";
import { ConflictError } from "../../errors/app-error";
import type { GmailInboundSyncStateRepository } from "./gmail-inbound-sync-state-repository";
import {
  buildGmailInboundSyncState,
  type GmailInboundSyncState,
  type GmailInboundSyncStateReasonCode,
} from "./gmail-inbound-sync-state-types";

type SyncStateCounters = {
  fetchedCount: number;
  normalizedCount: number;
  persistedCount: number;
  materializedCount: number;
};

function toNullIfBlank(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}

export class GmailInboundSyncStateService {
  constructor(private readonly repository: GmailInboundSyncStateRepository) {}

  async getByProviderAccountScoped(
    scope: WorkspaceScope,
    providerAccountId: string,
  ): Promise<GmailInboundSyncState | null> {
    return this.repository.findByProviderAccountScoped(
      scope,
      providerAccountId,
    );
  }

  async getOrCreateForProviderAccount(input: {
    scope: WorkspaceScope;
    providerAccountId: string;
    now?: Date;
  }): Promise<GmailInboundSyncState> {
    const existing = await this.repository.findByProviderAccountScoped(
      input.scope,
      input.providerAccountId,
    );

    if (existing) {
      return existing;
    }

    const now = input.now ?? new Date();

    return this.repository.createState(
      buildGmailInboundSyncState({
        organizationId: input.scope.organizationId,
        workspaceId: input.scope.workspaceId,
        providerAccountId: input.providerAccountId,
        createdAt: now,
        updatedAt: now,
      }),
    );
  }

  async markStarted(input: {
    scope: WorkspaceScope;
    providerAccountId: string;
    now?: Date;
  }): Promise<GmailInboundSyncState> {
    const now = input.now ?? new Date();
    const existing = await this.getOrCreateForProviderAccount(input);

    if (existing.lastSyncStatus === "running") {
      throw new ConflictError("Gmail inbound sync is already running.");
    }

    return (await this.repository.updateState({
      scope: input.scope,
      providerAccountId: input.providerAccountId,
      lastSyncStatus: "running",
      lastStartedAt: now,
      updatedAt: now,
    })) as GmailInboundSyncState;
  }

  async updateCursor(input: {
    scope: WorkspaceScope;
    providerAccountId: string;
    lastHistoryId?: string | null;
    lastPageToken?: string | null;
    now?: Date;
  }): Promise<GmailInboundSyncState> {
    const now = input.now ?? new Date();
    await this.getOrCreateForProviderAccount(input);

    return (await this.repository.updateState({
      scope: input.scope,
      providerAccountId: input.providerAccountId,
      lastHistoryId: toNullIfBlank(input.lastHistoryId),
      lastPageToken: toNullIfBlank(input.lastPageToken),
      updatedAt: now,
    })) as GmailInboundSyncState;
  }

  async markCompleted(input: {
    scope: WorkspaceScope;
    providerAccountId: string;
    counters: SyncStateCounters;
    lastHistoryId?: string | null;
    lastPageToken?: string | null;
    now?: Date;
  }): Promise<GmailInboundSyncState> {
    const now = input.now ?? new Date();
    await this.getOrCreateForProviderAccount(input);

    return (await this.repository.updateState({
      scope: input.scope,
      providerAccountId: input.providerAccountId,
      lastHistoryId: toNullIfBlank(input.lastHistoryId),
      lastPageToken: toNullIfBlank(input.lastPageToken),
      lastSyncStatus: "completed",
      lastCompletedAt: now,
      lastFailureReasonCode: null,
      lastFetchedCount: input.counters.fetchedCount,
      lastNormalizedCount: input.counters.normalizedCount,
      lastPersistedCount: input.counters.persistedCount,
      lastMaterializedCount: input.counters.materializedCount,
      updatedAt: now,
    })) as GmailInboundSyncState;
  }

  async markPartial(input: {
    scope: WorkspaceScope;
    providerAccountId: string;
    counters: SyncStateCounters;
    reasonCode?: GmailInboundSyncStateReasonCode | null;
    lastHistoryId?: string | null;
    lastPageToken?: string | null;
    now?: Date;
  }): Promise<GmailInboundSyncState> {
    const now = input.now ?? new Date();
    await this.getOrCreateForProviderAccount(input);

    return (await this.repository.updateState({
      scope: input.scope,
      providerAccountId: input.providerAccountId,
      lastHistoryId: toNullIfBlank(input.lastHistoryId),
      lastPageToken: toNullIfBlank(input.lastPageToken),
      lastSyncStatus: "partial",
      lastCompletedAt: now,
      lastFailureReasonCode: input.reasonCode ?? null,
      lastFetchedCount: input.counters.fetchedCount,
      lastNormalizedCount: input.counters.normalizedCount,
      lastPersistedCount: input.counters.persistedCount,
      lastMaterializedCount: input.counters.materializedCount,
      updatedAt: now,
    })) as GmailInboundSyncState;
  }

  async markFailed(input: {
    scope: WorkspaceScope;
    providerAccountId: string;
    reasonCode: GmailInboundSyncStateReasonCode;
    counters?: Partial<SyncStateCounters>;
    now?: Date;
  }): Promise<GmailInboundSyncState> {
    const now = input.now ?? new Date();
    await this.getOrCreateForProviderAccount(input);

    return (await this.repository.updateState({
      scope: input.scope,
      providerAccountId: input.providerAccountId,
      lastSyncStatus: "failed",
      lastFailedAt: now,
      lastFailureReasonCode: input.reasonCode,
      lastFetchedCount: input.counters?.fetchedCount ?? 0,
      lastNormalizedCount: input.counters?.normalizedCount ?? 0,
      lastPersistedCount: input.counters?.persistedCount ?? 0,
      lastMaterializedCount: input.counters?.materializedCount ?? 0,
      updatedAt: now,
    })) as GmailInboundSyncState;
  }
}
