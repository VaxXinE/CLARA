import { and, eq } from "drizzle-orm";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type { Database } from "../db/client";
import { demoSeedData } from "../db/fixtures/demo-data";
import { users, workspaceMemberships } from "../db/schema";

export type WorkspaceMemberRecord = {
  userId: string;
  displayName: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
};

export interface UserRoleManagementRepository {
  listWorkspaceMembers(scope: WorkspaceScope): Promise<WorkspaceMemberRecord[]>;
}

function toMembershipStatus(status: string): WorkspaceMemberRecord["status"] {
  if (status === "active" || status === "inactive") {
    return status;
  }

  throw new Error("Invalid workspace membership status.");
}

export class FixtureUserRoleManagementRepository implements UserRoleManagementRepository {
  async listWorkspaceMembers(
    scope: WorkspaceScope,
  ): Promise<WorkspaceMemberRecord[]> {
    return demoSeedData.workspaceMemberships
      .filter(
        (membership) =>
          membership.organizationId === scope.organizationId &&
          membership.workspaceId === scope.workspaceId,
      )
      .map((membership) => {
        const user = demoSeedData.users.find(
          (candidate) => candidate.id === membership.userId,
        );

        if (!user) {
          throw new Error("Workspace member user fixture is missing.");
        }

        return {
          userId: user.id,
          displayName: user.displayName,
          email: user.email,
          role: membership.role,
          status: toMembershipStatus(membership.status ?? "active"),
          createdAt: membership.createdAt ?? new Date(0),
          updatedAt: membership.updatedAt ?? new Date(0),
        };
      });
  }
}

export class DrizzleUserRoleManagementRepository implements UserRoleManagementRepository {
  constructor(private readonly db: Database) {}

  async listWorkspaceMembers(
    scope: WorkspaceScope,
  ): Promise<WorkspaceMemberRecord[]> {
    const rows = await this.db
      .select({
        userId: users.id,
        displayName: users.displayName,
        email: users.email,
        role: workspaceMemberships.role,
        status: workspaceMemberships.status,
        createdAt: workspaceMemberships.createdAt,
        updatedAt: workspaceMemberships.updatedAt,
      })
      .from(workspaceMemberships)
      .innerJoin(users, eq(users.id, workspaceMemberships.userId))
      .where(
        and(
          eq(workspaceMemberships.organizationId, scope.organizationId),
          eq(workspaceMemberships.workspaceId, scope.workspaceId),
        ),
      );

    return rows.map((row) => ({
      ...row,
      status: toMembershipStatus(row.status),
    }));
  }
}
