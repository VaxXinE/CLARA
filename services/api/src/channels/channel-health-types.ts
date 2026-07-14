import type { ChannelProvider } from "./channel-registry-types";

export type ChannelHealthStatus =
  | "connected"
  | "disconnected"
  | "degraded"
  | "auth_required"
  | "rate_limited"
  | "error"
  | "simulated_only"
  | "unsupported";

export type ChannelReadinessLevel = "production" | "simulated" | "planned";

export type ChannelHealthItem = {
  channel: string;
  provider: ChannelProvider;
  status: ChannelHealthStatus;
  readinessLevel: ChannelReadinessLevel;
  workspaceId: string;
  accountId: string | null;
  safeSummary: string;
  safeReasonCode: string;
  lastCheckedAt: string | null;
  nextRecommendedAction: string;
};

export type ChannelHealthResponse = {
  data: {
    items: ChannelHealthItem[];
  };
};
