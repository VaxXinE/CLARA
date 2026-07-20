import type { PermissionAuditRoleBoundary } from "./permission-audit-types";

export const permissionAuditRoleBoundaries: PermissionAuditRoleBoundary[] = [
  {
    role: "owner",
    allowedSurfaceKeys: [
      "conversation_read",
      "customer_read",
      "activity_read",
      "channel_read",
      "ai_draft_create",
      "reply_send",
      "gmail_connect",
      "enterprise_readiness_read",
    ],
    deniedSurfaceKeys: ["role_mutation", "permission_mutation"],
    auditRequiredForDeniedAccess: true,
    mutationAllowed: false,
  },
  {
    role: "agent",
    allowedSurfaceKeys: [
      "conversation_read",
      "customer_read",
      "activity_read",
      "channel_read",
      "ai_draft_create",
      "reply_send",
      "enterprise_readiness_read",
    ],
    deniedSurfaceKeys: ["role_mutation", "permission_mutation"],
    auditRequiredForDeniedAccess: true,
    mutationAllowed: false,
  },
  {
    role: "viewer",
    allowedSurfaceKeys: [
      "conversation_read",
      "customer_read",
      "activity_read",
      "channel_read",
      "enterprise_readiness_read",
    ],
    deniedSurfaceKeys: [
      "ai_draft_create",
      "reply_send",
      "gmail_connect",
      "role_mutation",
      "permission_mutation",
    ],
    auditRequiredForDeniedAccess: true,
    mutationAllowed: false,
  },
];

export function getPermissionAuditRoleBoundaries() {
  return permissionAuditRoleBoundaries;
}
