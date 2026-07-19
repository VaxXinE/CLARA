export const customerLifecycleStatusReadinessPolicyVersion =
  "lifecycle-status-update-readiness-v1";

export const customerLifecycleValues = [
  "lead",
  "active_customer",
  "at_risk",
  "inactive",
  "unknown",
] as const;

export const customerStatusValues = [
  "new",
  "engaged",
  "needs_follow_up",
  "dormant",
  "unknown",
] as const;

export const customerLifecycleStatusReadinessLevels = [
  "ready_for_review",
  "needs_more_context",
  "blocked",
  "no_change_recommended",
  "unknown",
] as const;

export const customerLifecycleStatusRecommendedActions = [
  "no_op",
  "review_lifecycle_status",
  "update_lifecycle_review",
  "update_status_review",
  "request_more_context",
  "escalate_to_admin_review",
] as const;

export const customerLifecycleStatusRiskLevels = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export function containsUnsafeLifecycleStatusInput(value: unknown): boolean {
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
    "skip approval",
    "execute immediately",
    "change status now",
    "change lifecycle now",
    "create task",
    "write note",
    "assign owner",
  ].some((pattern) => text.includes(pattern));
}
