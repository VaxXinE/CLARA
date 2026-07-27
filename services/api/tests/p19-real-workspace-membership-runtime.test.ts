import { describe, expect, it } from "vitest";
import type {
  ProviderMappedUser,
  WorkspaceMembershipRecord,
  WorkspaceMembershipRepository,
} from "../src/auth/workspace-membership-repository";
import { WorkspaceMembershipService } from "../src/auth/workspace-membership-service";
import { AuthorizationError } from "../src/errors/app-error";

class MemoryWorkspaceMembershipRepository
  implements WorkspaceMembershipRepository
{
  constructor(
    private readonly users: ProviderMappedUser[],
    private readonly memberships: WorkspaceMembershipRecord[],
  ) {}

  async findUserByProviderSubject(
    providerSubject: string,
  ): Promise<ProviderMappedUser | null> {
    return (
      this.users.find((user) => user.providerSubject === providerSubject) ??
      null
    );
  }

  async listMembershipsByUserId(
    userId: string,
  ): Promise<WorkspaceMembershipRecord[]> {
    return this.memberships.filter((membership) => membership.userId === userId);
  }
}

function user(userId: string, roleSubject: string): ProviderMappedUser {
  return {
    userId,
    organizationId: "org_real_internal",
    providerSubject: roleSubject,
    email: `${userId}@example.test`,
    status: "active",
  };
}

function membership(
  userId: string,
  role: "owner" | "agent" | "viewer",
  status: "active" | "inactive" = "active",
): WorkspaceMembershipRecord {
  return {
    membershipId: `mem_${userId}`,
    organizationId: "org_real_internal",
    workspaceId: "wks_real_internal",
    userId,
    role,
    status,
  };
}

function createService(
  users: ProviderMappedUser[],
  memberships: WorkspaceMembershipRecord[],
) {
  return new WorkspaceMembershipService(
    new MemoryWorkspaceMembershipRepository(users, memberships),
  );
}

describe("P19 real workspace membership runtime", () => {
  it.each([
    ["owner", "usr_owner", "subject_owner"],
    ["agent", "usr_agent", "subject_agent"],
    ["viewer", "usr_viewer", "subject_viewer"],
  ] as const)(
    "resolves active %s membership from backend data",
    async (role, id, subject) => {
      const service = createService([user(id, subject)], [membership(id, role)]);

      await expect(
        service.getActiveWorkspaceAccessForTrustedIdentity({
          provider: "supabase",
          subject,
          email: `${id}@example.test`,
        }),
      ).resolves.toMatchObject({
        userId: id,
        organizationId: "org_real_internal",
        workspaceId: "wks_real_internal",
        role,
      });
    },
  );

  it("fails closed for missing or inactive membership", async () => {
    const noMembership = createService(
      [user("usr_missing", "subject_missing")],
      [],
    );
    const inactive = createService(
      [user("usr_inactive", "subject_inactive")],
      [membership("usr_inactive", "agent", "inactive")],
    );

    await expect(
      noMembership.getActiveWorkspaceAccessForTrustedIdentity({
        provider: "supabase",
        subject: "subject_missing",
      }),
    ).rejects.toBeInstanceOf(AuthorizationError);
    await expect(
      inactive.getActiveWorkspaceAccessForTrustedIdentity({
        provider: "supabase",
        subject: "subject_inactive",
      }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});
