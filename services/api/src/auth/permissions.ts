import { AuthorizationError } from "../errors/app-error";

export const roles = ["owner", "agent", "viewer"] as const;

export type Role = (typeof roles)[number];

export const permissions = [
  "conversation:read",
  "customer:read",
  "activity:read",
  "channel:read",
  "ai_draft:create",
  "reply:send",
  "integration:gmail_connect",
] as const;

export type Permission = (typeof permissions)[number];

const rolePermissions: Record<Role, ReadonlySet<Permission>> = {
  owner: new Set(permissions),
  agent: new Set(permissions),
  viewer: new Set([
    "conversation:read",
    "customer:read",
    "activity:read",
    "channel:read",
  ]),
};

export function getPermissionsForRole(role: Role): Permission[] {
  return [...rolePermissions[role]];
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].has(permission);
}

export function assertPermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new AuthorizationError();
  }
}
