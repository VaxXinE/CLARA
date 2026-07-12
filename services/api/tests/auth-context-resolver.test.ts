import { describe, expect, it } from "vitest";
import { resolveAuthContextFromTrustedProviderIdentity } from "../src/auth/auth-context-resolver";
import type { TrustedProviderIdentity } from "../src/auth/provider-identity";
import type {
  ProviderMappedUser,
  WorkspaceMembershipRecord,
  WorkspaceMembershipRepository,
} from "../src/auth/workspace-membership-repository";
import { FixtureWorkspaceMembershipRepository } from "../src/auth/workspace-membership-repository";
import { WorkspaceMembershipService } from "../src/auth/workspace-membership-service";
import { AuthorizationError } from "../src/errors/app-error";

function identity(subject: string): TrustedProviderIdentity {
  return {
    provider: "supabase",
    subject,
  };
}

class StubWorkspaceMembershipRepository implements WorkspaceMembershipRepository {
  constructor(
    private readonly user: ProviderMappedUser | null,
    private readonly memberships: WorkspaceMembershipRecord[],
  ) {}

  async findUserByProviderSubject(): Promise<ProviderMappedUser | null> {
    return this.user;
  }

  async listMembershipsByUserId(): Promise<WorkspaceMembershipRecord[]> {
    return this.memberships;
  }
}

describe("auth context resolver", () => {
  it("builds a provider auth context from trusted identity and active membership", async () => {
    const service = new WorkspaceMembershipService(
      new FixtureWorkspaceMembershipRepository(),
    );

    await expect(
      resolveAuthContextFromTrustedProviderIdentity(
        identity("subject_demo_viewer"),
        service,
      ),
    ).resolves.toEqual({
      userId: "usr_demo_viewer",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      role: "viewer",
      permissions: [
        "conversation:read",
        "customer:read",
        "activity:read",
        "channel:read",
      ],
      authMethod: "provider",
    });
  });

  it("fails closed when the provider subject is not mapped to a CLARA user", async () => {
    const service = new WorkspaceMembershipService(
      new FixtureWorkspaceMembershipRepository(),
    );

    await expect(
      resolveAuthContextFromTrustedProviderIdentity(
        identity("subject_missing_user"),
        service,
      ),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("fails closed when no active membership exists", async () => {
    const service = new WorkspaceMembershipService(
      new StubWorkspaceMembershipRepository(
        {
          userId: "usr_no_membership",
          organizationId: "org_demo",
          providerSubject: "subject_demo_none",
          email: "no-membership@example.test",
          status: "active",
        },
        [],
      ),
    );

    await expect(
      resolveAuthContextFromTrustedProviderIdentity(
        identity("subject_demo_none"),
        service,
      ),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("fails closed when the membership role is unsupported", async () => {
    const service = new WorkspaceMembershipService(
      new StubWorkspaceMembershipRepository(
        {
          userId: "usr_bad_role",
          organizationId: "org_demo",
          providerSubject: "subject_demo_bad_role",
          email: "bad-role@example.test",
          status: "active",
        },
        [
          {
            membershipId: "mem_bad_role",
            organizationId: "org_demo",
            workspaceId: "wks_demo_sales",
            userId: "usr_bad_role",
            role: "admin",
            status: "active",
          },
        ],
      ),
    );

    await expect(
      resolveAuthContextFromTrustedProviderIdentity(
        identity("subject_demo_bad_role"),
        service,
      ),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("fails closed when multiple active memberships are present", async () => {
    const service = new WorkspaceMembershipService(
      new StubWorkspaceMembershipRepository(
        {
          userId: "usr_multi_workspace",
          organizationId: "org_demo",
          providerSubject: "subject_demo_multi_workspace",
          email: "multi-workspace@example.test",
          status: "active",
        },
        [
          {
            membershipId: "mem_one",
            organizationId: "org_demo",
            workspaceId: "wks_demo_sales",
            userId: "usr_multi_workspace",
            role: "agent",
            status: "active",
          },
          {
            membershipId: "mem_two",
            organizationId: "org_demo",
            workspaceId: "wks_demo_other",
            userId: "usr_multi_workspace",
            role: "viewer",
            status: "active",
          },
        ],
      ),
    );

    await expect(
      resolveAuthContextFromTrustedProviderIdentity(
        identity("subject_demo_multi_workspace"),
        service,
      ),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});
