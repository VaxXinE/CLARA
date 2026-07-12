import { assertPermission } from "../auth/permissions";
import type { AuthContext } from "../auth/auth-context";
import { NotFoundError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { ChannelAccountRepository } from "./channel-account-repository";
import type {
  ChannelAccountDto,
  ChannelAccountHealthDto,
  ChannelAccountRecord,
  CreateChannelAccountInput,
} from "./channel-account-types";

function toChannelAccountDto(record: ChannelAccountRecord): ChannelAccountDto {
  return {
    id: record.id,
    provider: record.provider,
    channel_type: record.channelType,
    display_name: record.displayName,
    external_account_id: record.externalAccountId,
    status: record.status,
    health_status: record.healthStatus,
    last_health_checked_at: record.lastHealthCheckedAt?.toISOString() ?? null,
    metadata: record.metadata,
    created_at: record.createdAt.toISOString(),
    updated_at: record.updatedAt.toISOString(),
  };
}

function toChannelAccountHealthDto(
  record: ChannelAccountRecord,
): ChannelAccountHealthDto {
  return {
    channel_account_id: record.id,
    provider: record.provider,
    status: record.status,
    health_status: record.healthStatus,
    last_health_checked_at: record.lastHealthCheckedAt?.toISOString() ?? null,
  };
}

export class ChannelAccountService {
  constructor(private readonly repository: ChannelAccountRepository) {}

  async createAccount(
    input: CreateChannelAccountInput,
  ): Promise<ChannelAccountDto> {
    return toChannelAccountDto(await this.repository.create(input));
  }

  async listAccounts(input: {
    auth: AuthContext;
  }): Promise<{ data: { items: ChannelAccountDto[] } }> {
    assertPermission(input.auth.role, "channel:read");

    const records = await this.repository.listScoped(
      getWorkspaceScopeFromAuth(input.auth),
    );

    return {
      data: {
        items: records.map(toChannelAccountDto),
      },
    };
  }

  async getAccount(input: {
    auth: AuthContext;
    channelAccountId: string;
  }): Promise<{ data: { account: ChannelAccountDto } }> {
    assertPermission(input.auth.role, "channel:read");

    const record = await this.repository.findByIdScoped(
      getWorkspaceScopeFromAuth(input.auth),
      input.channelAccountId,
    );

    if (!record) {
      throw new NotFoundError("Channel account not found.");
    }

    return {
      data: {
        account: toChannelAccountDto(record),
      },
    };
  }

  async getHealth(input: {
    auth: AuthContext;
    channelAccountId: string;
  }): Promise<{ data: { health: ChannelAccountHealthDto } }> {
    assertPermission(input.auth.role, "channel:read");

    const record = await this.repository.findByIdScoped(
      getWorkspaceScopeFromAuth(input.auth),
      input.channelAccountId,
    );

    if (!record) {
      throw new NotFoundError("Channel account not found.");
    }

    return {
      data: {
        health: toChannelAccountHealthDto(record),
      },
    };
  }
}
