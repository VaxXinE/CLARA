import { and, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { channelAccounts } from "../db/schema";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type { ChannelAccountRepository } from "./channel-account-repository";
import {
  sanitizeChannelAccountMetadata,
  toChannelAccountRecord,
} from "./channel-account-repository";
import type {
  ChannelAccountRecord,
  CreateChannelAccountInput,
} from "./channel-account-types";

export class DrizzleChannelAccountRepository implements ChannelAccountRepository {
  constructor(private readonly db: Database) {}

  async create(
    input: CreateChannelAccountInput,
  ): Promise<ChannelAccountRecord> {
    const now = new Date();
    const [row] = await this.db
      .insert(channelAccounts)
      .values({
        id: input.id,
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
      })
      .returning();

    if (!row) {
      throw new Error("Channel account insert did not return a row.");
    }

    return toChannelAccountRecord(row);
  }

  async listScoped(scope: WorkspaceScope): Promise<ChannelAccountRecord[]> {
    const rows = await this.db.query.channelAccounts.findMany({
      where: and(
        eq(channelAccounts.organizationId, scope.organizationId),
        eq(channelAccounts.workspaceId, scope.workspaceId),
      ),
    });

    return rows.map(toChannelAccountRecord);
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    channelAccountId: string,
  ): Promise<ChannelAccountRecord | null> {
    const row = await this.db.query.channelAccounts.findFirst({
      where: and(
        eq(channelAccounts.id, channelAccountId),
        eq(channelAccounts.organizationId, scope.organizationId),
        eq(channelAccounts.workspaceId, scope.workspaceId),
      ),
    });

    return row ? toChannelAccountRecord(row) : null;
  }

  async findByProviderExternalAccount(
    provider: "gmail" | "whatsapp" | "instagram" | "tiktok" | "webchat",
    externalAccountId: string,
  ): Promise<ChannelAccountRecord | null> {
    const row = await this.db.query.channelAccounts.findFirst({
      where: and(
        eq(channelAccounts.provider, provider),
        eq(channelAccounts.externalAccountId, externalAccountId),
      ),
    });

    return row ? toChannelAccountRecord(row) : null;
  }
}
