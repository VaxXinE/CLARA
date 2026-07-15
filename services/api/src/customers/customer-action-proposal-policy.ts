export const customerActionProposalPolicyVersion =
  "reviewable-crm-action-proposal-v1";

export const customerActionProposalTypes = [
  "follow_up_task_review",
  "customer_note_review",
  "status_change_review",
  "lifecycle_change_review",
  "owner_assignment_review",
  "needs_attention_review",
] as const;

export const customerActionProposalSources = [
  "operator",
  "customer_profile_intelligence",
  "customer_timeline_intelligence",
  "ai_suggestion_review",
  "system_review",
] as const;

export const proposalTypeConfig = {
  follow_up_task_review: {
    actionKind: "create_task",
    requiredPermission: "task:create",
    riskLevel: "medium",
    title: "Review follow-up task proposal",
  },
  customer_note_review: {
    actionKind: "save_note",
    requiredPermission: "customer:update",
    riskLevel: "medium",
    title: "Review customer note proposal",
  },
  status_change_review: {
    actionKind: "update_status",
    requiredPermission: "customer:update",
    riskLevel: "high",
    title: "Review status change proposal",
  },
  lifecycle_change_review: {
    actionKind: "update_lifecycle",
    requiredPermission: "customer:update",
    riskLevel: "high",
    title: "Review lifecycle change proposal",
  },
  owner_assignment_review: {
    actionKind: "assign_owner",
    requiredPermission: "customer:assign",
    riskLevel: "high",
    title: "Review owner assignment proposal",
  },
  needs_attention_review: {
    actionKind: "mark_needs_attention",
    requiredPermission: "customer:update",
    riskLevel: "low",
    title: "Review attention marker proposal",
  },
} as const;

export function containsUnsafeProposalIntent(value: unknown): boolean {
  const text = JSON.stringify(value ?? {}).toLowerCase();

  return [
    "access token",
    "refresh token",
    "authorization",
    "cookie",
    "provider payload",
    "webhook payload",
    "raw html",
    "raw dom",
    "raw prompt",
    "execute now",
    "skip approval",
  ].some((pattern) => text.includes(pattern));
}
