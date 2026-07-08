import { AuthorizationError } from "../errors/app-error";
import { roles, type Role } from "./permissions";
import type {
  WorkspaceMembershipRecord,
  WorkspaceMembershipRepository,
} from "./workspace-membership-repository";

export type TrustedProviderIdentity = {
  provider: "supabase" | "better-auth";
  subject: string;
  email?: string;
};

export type ActiveWorkspaceAccess = {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: Role;
};

const safeMembershipErrorMessage = "You do not have access to this workspace.";

function isRole(value: string): value is Role {
  return roles.includes(value as Role);
}

function selectSingleActiveMembership(
  memberships: WorkspaceMembershipRecord[],
): WorkspaceMembershipRecord {
  const activeMemberships = memberships.filter(
    (membership) => membership.status === "active",
  );

  if (activeMemberships.length !== 1) {
    throw new AuthorizationError(safeMembershipErrorMessage);
  }

  const membership = activeMemberships[0];

  if (!membership) {
    throw new AuthorizationError(safeMembershipErrorMessage);
  }

  return membership;
}

export class WorkspaceMembershipService {
  constructor(private readonly repository: WorkspaceMembershipRepository) {}

  async getActiveWorkspaceAccessForTrustedIdentity(
    identity: TrustedProviderIdentity,
  ): Promise<ActiveWorkspaceAccess> {
    const subject = identity.subject.trim();

    if (subject.length === 0) {
      throw new AuthorizationError(safeMembershipErrorMessage);
    }

    const user = await this.repository.findUserByProviderSubject(subject);

    if (!user || user.status !== "active") {
      throw new AuthorizationError(safeMembershipErrorMessage);
    }

    const membership = selectSingleActiveMembership(
      await this.repository.listMembershipsByUserId(user.userId),
    );

    if (membership.organizationId !== user.organizationId) {
      throw new AuthorizationError(safeMembershipErrorMessage);
    }

    if (!isRole(membership.role)) {
      throw new AuthorizationError(safeMembershipErrorMessage);
    }

    return {
      userId: user.userId,
      organizationId: membership.organizationId,
      workspaceId: membership.workspaceId,
      role: membership.role,
    };
  }
}
