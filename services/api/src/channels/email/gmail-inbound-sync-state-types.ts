import { randomUUID } from "node:crypto";

export const gmailInboundSyncStateStatuses = [
  "idle",
  "running",
  "completed",
  "partial",
  "failed",
] as const;

export const gmailInboundSyncStateReasonCodes = [
  "connection_unhealthy",
  "provider_fetch_failed",
  "message_fetch_failed",
  "no_messages",
] as const;

export type GmailInboundSyncStateStatus =
  (typeof gmailInboundSyncStateStatuses)[number];

export type GmailInboundSyncStateReasonCode =
  (typeof gmailInboundSyncStateReasonCodes)[number];

export type GmailInboundSyncState = {
  id: string;
  organizationId: string;
  workspaceId: string;
  providerAccountId: string;
  provider: "gmail";
  lastHistoryId: string | null;
  lastPageToken: string | null;
  lastSyncStatus: GmailInboundSyncStateStatus;
  lastStartedAt: Date | null;
  lastCompletedAt: Date | null;
  lastFailedAt: Date | null;
  lastFailureReasonCode: GmailInboundSyncStateReasonCode | null;
  lastFetchedCount: number;
  lastNormalizedCount: number;
  lastPersistedCount: number;
  lastMaterializedCount: number;
  createdAt: Date;
  updatedAt: Date;
};

function normalizeText(value: string): string {
  return value.trim();
}

function sanitizeOptionalText(
  value: string | null | undefined,
  maxLength: number,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = normalizeText(value);

  if (normalized.length === 0) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

function sanitizeCount(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.trunc(value);
}

export function buildGmailInboundSyncState(input: {
  id?: string;
  organizationId: string;
  workspaceId: string;
  providerAccountId: string;
  lastHistoryId?: string | null;
  lastPageToken?: string | null;
  lastSyncStatus?: GmailInboundSyncStateStatus;
  lastStartedAt?: Date | null;
  lastCompletedAt?: Date | null;
  lastFailedAt?: Date | null;
  lastFailureReasonCode?: GmailInboundSyncStateReasonCode | null;
  lastFetchedCount?: number;
  lastNormalizedCount?: number;
  lastPersistedCount?: number;
  lastMaterializedCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}): GmailInboundSyncState {
  const createdAt = input.createdAt ?? new Date();

  return {
    id: input.id ?? `gmail_sync_state_${randomUUID()}`,
    organizationId: normalizeText(input.organizationId),
    workspaceId: normalizeText(input.workspaceId),
    providerAccountId: normalizeText(input.providerAccountId),
    provider: "gmail",
    lastHistoryId: sanitizeOptionalText(input.lastHistoryId, 255),
    lastPageToken: sanitizeOptionalText(input.lastPageToken, 2048),
    lastSyncStatus: input.lastSyncStatus ?? "idle",
    lastStartedAt: input.lastStartedAt ?? null,
    lastCompletedAt: input.lastCompletedAt ?? null,
    lastFailedAt: input.lastFailedAt ?? null,
    lastFailureReasonCode: input.lastFailureReasonCode ?? null,
    lastFetchedCount: sanitizeCount(input.lastFetchedCount),
    lastNormalizedCount: sanitizeCount(input.lastNormalizedCount),
    lastPersistedCount: sanitizeCount(input.lastPersistedCount),
    lastMaterializedCount: sanitizeCount(input.lastMaterializedCount),
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
}
