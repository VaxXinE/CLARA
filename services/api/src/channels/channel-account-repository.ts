import type { InferInsertModel } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import { channelAccounts } from "../db/schema";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type {
  ChannelAccountMetadata,
  ChannelAccountRecord,
  ChannelAccountStatus,
  ChannelHealthStatus,
  CreateChannelAccountInput,
} from "./channel-account-types";
import type { ChannelProvider, ChannelType } from "./channel-registry-types";

type ChannelAccountInsert = InferInsertModel<typeof channelAccounts>;

export interface ChannelAccountRepository {
  create(input: CreateChannelAccountInput): Promise<ChannelAccountRecord>;
  listScoped(scope: WorkspaceScope): Promise<ChannelAccountRecord[]>;
  findByIdScoped(
    scope: WorkspaceScope,
    channelAccountId: string,
  ): Promise<ChannelAccountRecord | null>;
}

export function sanitizeChannelAccountMetadata(
  value: unknown,
): ChannelAccountMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const input = value as Record<string, unknown>;
  const metadata: ChannelAccountMetadata = {};

  if (typeof input.source === "string") {
    metadata.source = input.source.slice(0, 80);
  }

  if (typeof input.safe_note === "string") {
    metadata.safe_note = input.safe_note.slice(0, 200);
  }

  return metadata;
}

function requireDate(value: Date | undefined, field: string): Date {
  if (!value) {
    throw new Error(
      `Channel account row is missing required date field: ${field}`,
    );
  }

  return value;
}

export function toChannelAccountRecord(row: {
  id: string;
  organizationId: string;
  workspaceId: string;
  provider: string;
  channelType: string;
  displayName: string;
  externalAccountId?: string | null | undefined;
  status: string;
  healthStatus?: string | undefined;
  lastHealthCheckedAt?: Date | null | undefined;
  metadata?: unknown;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}): ChannelAccountRecord {
  return {
    id: row.id,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    provider: row.provider as ChannelProvider,
    channelType: row.channelType as ChannelType,
    displayName: row.displayName,
    externalAccountId: row.externalAccountId ?? null,
    status: row.status as ChannelAccountStatus,
    healthStatus: (row.healthStatus ?? "unknown") as ChannelHealthStatus,
    lastHealthCheckedAt: row.lastHealthCheckedAt ?? null,
    metadata: sanitizeChannelAccountMetadata(row.metadata),
    createdAt: requireDate(row.createdAt, "channelAccount.createdAt"),
    updatedAt: requireDate(row.updatedAt, "channelAccount.updatedAt"),
  };
}

function toInsert(input: CreateChannelAccountInput): ChannelAccountInsert {
  const now = new Date();

  return {
    id: input.id || `channel_account_${randomUUID()}`,
    organizationId: input.organizationId,
    workspaceId: input.workspaceId,
    provider: input.provider,
    channelType: input.channelType,
    displayName: input.displayName,
    externalAccountId: input.externalAccountId,
    status: input.status,
    healthStatus: input.healthStatus,
    lastHealthCheckedAt: input.lastHealthCheckedAt,
    metadata: sanitizeChannelAccountMetadata(input.metadata),
    createdAt: now,
    updatedAt: now,
  };
}

export class FixtureChannelAccountRepository implements ChannelAccountRepository {
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async create(
    input: CreateChannelAccountInput,
  ): Promise<ChannelAccountRecord> {
    const row = toInsert(input);
    this.store.channelAccounts.push(row);
    return toChannelAccountRecord(row);
  }

  async listScoped(scope: WorkspaceScope): Promise<ChannelAccountRecord[]> {
    return this.store.channelAccounts
      .filter(
        (account) =>
          account.organizationId === scope.organizationId &&
          account.workspaceId === scope.workspaceId,
      )
      .map(toChannelAccountRecord);
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    channelAccountId: string,
  ): Promise<ChannelAccountRecord | null> {
    const row =
      this.store.channelAccounts.find(
        (account) =>
          account.id === channelAccountId &&
          account.organizationId === scope.organizationId &&
          account.workspaceId === scope.workspaceId,
      ) ?? null;

    return row ? toChannelAccountRecord(row) : null;
  }
}
