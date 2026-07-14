import type { Role } from "./permissions";
import { AuthorizationError } from "../errors/app-error";

export type UserRoleManagementPolicy = {
  role: Role;
  can_read_members: boolean;
  can_read_readiness: boolean;
  can_invite_users: false;
  can_update_roles: false;
  can_delete_users: false;
  mutation_status: "not_implemented";
};

export function getUserRoleManagementPolicy(
  role: Role,
): UserRoleManagementPolicy {
  const canRead = role === "owner";

  return {
    role,
    can_read_members: canRead,
    can_read_readiness: canRead,
    can_invite_users: false,
    can_update_roles: false,
    can_delete_users: false,
    mutation_status: "not_implemented",
  };
}

export function assertCanReadUserRoleManagement(role: Role): void {
  if (!getUserRoleManagementPolicy(role).can_read_members) {
    throw new AuthorizationError();
  }
}
