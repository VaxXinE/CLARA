export type ChannelProvider =
  "gmail" | "whatsapp" | "instagram" | "tiktok" | "webchat";

export type ChannelType = "email" | "messaging" | "social" | "webchat";

export type ChannelProductionStatus = "available" | "planned" | "disabled";

export type ChannelCapability = {
  provider: ChannelProvider;
  channel_type: ChannelType;
  display_name: string;
  inbound_supported: boolean;
  outbound_supported: boolean;
  oauth_supported: boolean;
  manual_sync_supported: boolean;
  scheduler_supported: boolean;
  audit_supported: boolean;
  dashboard_status_supported: boolean;
  production_status: ChannelProductionStatus;
  safe_notes: string;
};
