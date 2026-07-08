import type { Permission, Role } from "./permissions";
import { hasPermission } from "./permissions";

export type PermissionHints = {
  can_view_conversation: boolean;
  can_view_customer_profile: boolean;
  can_view_activity: boolean;
  can_generate_ai_draft: boolean;
  can_send_reply: boolean;
};

function can(role: Role, permission: Permission): boolean {
  return hasPermission(role, permission);
}

export function buildPermissionHints(role: Role): PermissionHints {
  return {
    can_view_conversation: can(role, "conversation:read"),
    can_view_customer_profile: can(role, "customer:read"),
    can_view_activity: can(role, "activity:read"),
    can_generate_ai_draft: can(role, "ai_draft:create"),
    can_send_reply: can(role, "reply:send"),
  };
}
