export const customerFollowUpProposalPolicyVersion =
  "task-follow-up-workflow-proposal-v1";

export const customerFollowUpProposalSources = [
  "operator",
  "customer_profile_intelligence",
  "customer_timeline_intelligence",
  "action_proposal_review",
  "ai_suggestion_review",
  "system_review",
] as const;

export const customerFollowUpProposalIntents = [
  "review_customer",
  "follow_up_customer",
  "request_more_context",
  "update_profile_review",
  "re_engage_customer",
  "no_op",
] as const;

export const followUpIntentConfig = {
  review_customer: {
    recommendedChannel: "manual",
    urgency: "low",
    dueWindow: "this_week",
    requiredPermission: "customer:read",
    taskTitle: "Review customer context",
  },
  follow_up_customer: {
    recommendedChannel: "email",
    urgency: "medium",
    dueWindow: "next_24h",
    requiredPermission: "task:create",
    taskTitle: "Review follow-up task",
  },
  request_more_context: {
    recommendedChannel: "manual",
    urgency: "medium",
    dueWindow: "next_48h",
    requiredPermission: "customer:read",
    taskTitle: "Review missing customer context",
  },
  update_profile_review: {
    recommendedChannel: "manual",
    urgency: "low",
    dueWindow: "this_week",
    requiredPermission: "customer:update",
    taskTitle: "Review customer profile update",
  },
  re_engage_customer: {
    recommendedChannel: "email",
    urgency: "high",
    dueWindow: "today",
    requiredPermission: "task:create",
    taskTitle: "Review customer re-engagement",
  },
  no_op: {
    recommendedChannel: "unknown",
    urgency: "low",
    dueWindow: "none",
    requiredPermission: "customer:read",
    taskTitle: "No follow-up task proposed",
  },
} as const;

export function containsUnsafeFollowUpIntent(value: unknown): boolean {
  const text = JSON.stringify(value ?? {}).toLowerCase();

  return [
    "access token",
    "refresh token",
    "authorization",
    "cookie",
    "api key",
    "secret",
    "provider payload",
    "webhook payload",
    "raw html",
    "raw dom",
    "raw prompt",
    "create task now",
    "auto create task",
    "schedule automatically",
    "send message",
    "skip approval",
  ].some((pattern) => text.includes(pattern));
}
