import type { ChannelProvider, ChannelType } from "./channel-registry-types";

export type ChannelAccountStatus =
  "connected" | "disconnected" | "degraded" | "disabled" | "planned";

export type ChannelHealthStatus =
  "healthy" | "degraded" | "unavailable" | "unknown";

export type ChannelAccountMetadata = {
  source?: string;
  safe_note?: string;
};

export type ChannelAccountRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  provider: ChannelProvider;
  channelType: ChannelType;
  displayName: string;
  externalAccountId: string | null;
  status: ChannelAccountStatus;
  healthStatus: ChannelHealthStatus;
  lastHealthCheckedAt: Date | null;
  metadata: ChannelAccountMetadata;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateChannelAccountInput = Omit<
  ChannelAccountRecord,
  "createdAt" | "updatedAt" | "metadata"
> & {
  metadata?: unknown;
};

export type ChannelAccountDto = {
  id: string;
  provider: ChannelProvider;
  channel_type: ChannelType;
  display_name: string;
  external_account_id: string | null;
  status: ChannelAccountStatus;
  health_status: ChannelHealthStatus;
  last_health_checked_at: string | null;
  metadata: ChannelAccountMetadata;
  created_at: string;
  updated_at: string;
};

export type ChannelAccountHealthDto = {
  channel_account_id: string;
  provider: ChannelProvider;
  status: ChannelAccountStatus;
  health_status: ChannelHealthStatus;
  last_health_checked_at: string | null;
};
