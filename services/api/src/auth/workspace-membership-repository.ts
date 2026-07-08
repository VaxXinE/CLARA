import { and, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { demoSeedData } from "../db/fixtures/demo-data";
import { users, workspaceMemberships } from "../db/schema";

type ProviderMappedUserStatus = "active" | "disabled";
type WorkspaceMembershipStatus = "active" | "inactive";

function normalizeUserStatus(
  status: string | undefined,
): ProviderMappedUserStatus {
  if (status === "active" || status === "disabled") {
    return status;
  }

  throw new Error("Invalid user status for workspace membership lookup.");
}

function normalizeMembershipStatus(
  status: string | undefined,
): WorkspaceMembershipStatus {
  if (status === "active" || status === "inactive") {
    return status;
  }

  throw new Error(
    "Invalid workspace membership status for workspace membership lookup.",
  );
}

export type ProviderMappedUser = {
  userId: string;
  organizationId: string;
  providerSubject: string | null;
  email: string;
  status: ProviderMappedUserStatus;
};

export type WorkspaceMembershipRecord = {
  membershipId: string;
  organizationId: string;
  workspaceId: string;
  userId: string;
  role: string;
  status: WorkspaceMembershipStatus;
};

export interface WorkspaceMembershipRepository {
  findUserByProviderSubject(
    providerSubject: string,
  ): Promise<ProviderMappedUser | null>;
  listMembershipsByUserId(userId: string): Promise<WorkspaceMembershipRecord[]>;
}

export class FixtureWorkspaceMembershipRepository implements WorkspaceMembershipRepository {
  async findUserByProviderSubject(
    providerSubject: string,
  ): Promise<ProviderMappedUser | null> {
    const user =
      demoSeedData.users.find(
        (candidate) => candidate.providerSubject === providerSubject,
      ) ?? null;

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      organizationId: user.organizationId,
      providerSubject: user.providerSubject ?? null,
      email: user.email,
      status: normalizeUserStatus(user.status),
    };
  }

  async listMembershipsByUserId(
    userId: string,
  ): Promise<WorkspaceMembershipRecord[]> {
    return demoSeedData.workspaceMemberships
      .filter((membership) => membership.userId === userId)
      .map((membership) => ({
        membershipId: membership.id,
        organizationId: membership.organizationId,
        workspaceId: membership.workspaceId,
        userId: membership.userId,
        role: membership.role,
        status: normalizeMembershipStatus(membership.status),
      }));
  }
}

export class DrizzleWorkspaceMembershipRepository implements WorkspaceMembershipRepository {
  constructor(private readonly db: Database) {}

  async findUserByProviderSubject(
    providerSubject: string,
  ): Promise<ProviderMappedUser | null> {
    const [user] = await this.db
      .select({
        userId: users.id,
        organizationId: users.organizationId,
        providerSubject: users.providerSubject,
        email: users.email,
        status: users.status,
      })
      .from(users)
      .where(eq(users.providerSubject, providerSubject))
      .limit(1);

    if (!user) {
      return null;
    }

    return {
      ...user,
      status: normalizeUserStatus(user.status),
    };
  }

  async listMembershipsByUserId(
    userId: string,
  ): Promise<WorkspaceMembershipRecord[]> {
    const memberships = await this.db
      .select({
        membershipId: workspaceMemberships.id,
        organizationId: workspaceMemberships.organizationId,
        workspaceId: workspaceMemberships.workspaceId,
        userId: workspaceMemberships.userId,
        role: workspaceMemberships.role,
        status: workspaceMemberships.status,
      })
      .from(workspaceMemberships)
      .where(and(eq(workspaceMemberships.userId, userId)));

    return memberships.map((membership) => ({
      ...membership,
      status: normalizeMembershipStatus(membership.status),
    }));
  }
}
