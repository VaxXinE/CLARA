export type ChannelOperationalStatus =
  | "connected"
  | "disconnected"
  | "degraded"
  | "auth_required"
  | "rate_limited"
  | "outage"
  | "unsupported";

export type ChannelOperationalSignal = {
  channel: string;
  provider: string;
  workspaceId: string;
  status: ChannelOperationalStatus;
  readinessLevel: "production" | "simulated" | "planned";
  safeReasonCode: string;
  correlationId: string;
  lastHealthCheckedAt?: string | null;
  retryCount?: number;
  deadLetterCount?: number;
  webhookAcceptedCount?: number;
  webhookRejectedCount?: number;
  outboundQueuedCount?: number;
  outboundSendingCount?: number;
  outboundSentCount?: number;
  outboundFailedCount?: number;
  outboundRetryingCount?: number;
  outboundDeadLetterCount?: number;
};
