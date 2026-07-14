import type { AuthContext } from "./auth-context";
import {
  assertCanReadUserRoleManagement,
  getUserRoleManagementPolicy,
} from "./user-role-management-policy";
import type { UserRoleManagementRepository } from "./user-role-management-repository";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";

export type WorkspaceMemberDto = {
  user_id: string;
  display_name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export type WorkspaceMembersResponse = {
  data: {
    members: WorkspaceMemberDto[];
  };
  permissions: {
    can_read_members: boolean;
    can_invite_users: false;
    can_update_roles: false;
    can_delete_users: false;
  };
};

export type RoleManagementReadinessResponse = {
  data: {
    status: "readiness_only";
    workspace_id: string;
    current_user: {
      id: string;
      role: string;
    };
    policy: ReturnType<typeof getUserRoleManagementPolicy>;
    disabled_controls: ["invite_user", "update_role", "delete_user"];
    message: string;
  };
};

export class UserRoleManagementService {
  constructor(private readonly repository: UserRoleManagementRepository) {}

  async listWorkspaceMembers(
    auth: AuthContext,
  ): Promise<WorkspaceMembersResponse> {
    assertCanReadUserRoleManagement(auth.role);

    const policy = getUserRoleManagementPolicy(auth.role);
    const members = await this.repository.listWorkspaceMembers(
      getWorkspaceScopeFromAuth(auth),
    );

    return {
      data: {
        members: members.map((member) => ({
          user_id: member.userId,
          display_name: member.displayName,
          email: member.email,
          role: member.role,
          status: member.status,
          created_at: member.createdAt.toISOString(),
          updated_at: member.updatedAt.toISOString(),
        })),
      },
      permissions: {
        can_read_members: policy.can_read_members,
        can_invite_users: policy.can_invite_users,
        can_update_roles: policy.can_update_roles,
        can_delete_users: policy.can_delete_users,
      },
    };
  }

  getRoleManagementReadiness(
    auth: AuthContext,
  ): RoleManagementReadinessResponse {
    assertCanReadUserRoleManagement(auth.role);

    return {
      data: {
        status: "readiness_only",
        workspace_id: auth.workspaceId,
        current_user: {
          id: auth.userId,
          role: auth.role,
        },
        policy: getUserRoleManagementPolicy(auth.role),
        disabled_controls: ["invite_user", "update_role", "delete_user"],
        message:
          "User invites, role changes, and membership deletion are not implemented yet. Backend authorization remains the source of truth.",
      },
    };
  }
}
