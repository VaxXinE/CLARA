export const customerTimelineIntelligencePolicyVersion =
  "customer-timeline-intelligence-read-model-v1";

export const customerTimelineEventTypes = [
  "customer_created",
  "conversation_started",
  "conversation_updated",
  "inbound_message",
  "outbound_reply",
  "channel_event",
  "activity_event",
  "ai_suggestion",
  "customer_profile_signal",
  "unknown",
] as const;

export const customerTimelineEventSources = [
  "customer",
  "conversation",
  "reply",
  "activity",
  "channel",
  "ai_read_model",
  "system",
] as const;

export const customerTimelineEventSeverities = [
  "info",
  "attention",
  "risk",
  "success",
] as const;

export function toTimelineSeverity(status: string): "info" | "attention" {
  return ["open", "pending", "needs_follow_up"].includes(status)
    ? "attention"
    : "info";
}
