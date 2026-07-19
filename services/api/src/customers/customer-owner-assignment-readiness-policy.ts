export const customerOwnerAssignmentReadinessPolicyVersion =
  "owner-assignment-readiness-v1";

export const ownerAssignmentReadinessLevels = [
  "ready_for_review",
  "needs_more_context",
  "already_owned",
  "blocked",
  "unknown",
] as const;

export const ownerAssignmentRecommendedRoles = [
  "sales",
  "support",
  "admin_review",
  "owner_review",
  "unknown",
] as const;

export const ownerAssignmentRecommendedActions = [
  "no_op",
  "review_assignment",
  "assign_owner_review",
  "escalate_to_admin_review",
  "request_more_context",
] as const;

export const ownerAssignmentRiskLevels = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export function containsUnsafeOwnerAssignmentInput(value: unknown): boolean {
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
    "change owner now",
    "skip approval",
    "execute immediately",
    "change lifecycle",
    "create task",
    "write note",
  ].some((pattern) => text.includes(pattern));
}
