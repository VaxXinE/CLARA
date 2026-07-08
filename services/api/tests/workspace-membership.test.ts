import { describe, expect, it } from "vitest";
import { AuthorizationError } from "../src/errors/app-error";
import { FixtureWorkspaceMembershipRepository } from "../src/auth/workspace-membership-repository";
import {
  WorkspaceMembershipService,
  type TrustedProviderIdentity,
} from "../src/auth/workspace-membership-service";

function trustedIdentity(subject: string): TrustedProviderIdentity {
  return {
    provider: "supabase",
    subject,
  };
}

describe("workspace membership lookup", () => {
  it("finds a seeded user by provider subject", async () => {
    const repository = new FixtureWorkspaceMembershipRepository();

    await expect(
      repository.findUserByProviderSubject("subject_demo_agent"),
    ).resolves.toMatchObject({
      userId: "usr_demo_agent",
      organizationId: "org_demo",
      status: "active",
    });
  });

  it("lists memberships including inactive status from fixtures", async () => {
    const repository = new FixtureWorkspaceMembershipRepository();

    await expect(
      repository.listMembershipsByUserId("usr_demo_inactive_membership"),
    ).resolves.toEqual([
      expect.objectContaining({
        workspaceId: "wks_demo_sales",
        role: "agent",
        status: "inactive",
      }),
    ]);
  });

  it("resolves a single active membership for a trusted provider identity", async () => {
    const service = new WorkspaceMembershipService(
      new FixtureWorkspaceMembershipRepository(),
    );

    await expect(
      service.getActiveWorkspaceAccessForTrustedIdentity(
        trustedIdentity("subject_demo_owner"),
      ),
    ).resolves.toEqual({
      userId: "usr_demo_owner",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      role: "owner",
    });
  });

  it("fails closed when only inactive memberships exist", async () => {
    const service = new WorkspaceMembershipService(
      new FixtureWorkspaceMembershipRepository(),
    );

    await expect(
      service.getActiveWorkspaceAccessForTrustedIdentity(
        trustedIdentity("subject_demo_inactive_membership"),
      ),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});
