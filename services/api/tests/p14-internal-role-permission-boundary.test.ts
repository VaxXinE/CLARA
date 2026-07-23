import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { getUserRoleManagementPolicy } from "../src/auth/user-role-management-policy";
import { FixtureUserRoleManagementRepository } from "../src/auth/user-role-management-repository";
import { UserRoleManagementService } from "../src/auth/user-role-management-service";

function auth(
  role: "owner" | "agent" | "viewer",
  workspaceId = "wks_demo_sales",
) {
  return buildAuthContext({
    userId: `usr_demo_${role}`,
    organizationId: "org_demo",
    workspaceId,
    role,
  });
}

describe("P14 internal role permission boundary", () => {
  it("keeps owner as the only role-management readiness reader", async () => {
    const service = new UserRoleManagementService(
      new FixtureUserRoleManagementRepository(),
    );

    expect(getUserRoleManagementPolicy("owner").can_read_members).toBe(true);
    expect(getUserRoleManagementPolicy("agent").can_read_members).toBe(false);
    expect(getUserRoleManagementPolicy("viewer").can_read_members).toBe(false);

    await expect(
      service.listWorkspaceMembers(auth("owner")),
    ).resolves.toBeDefined();
    await expect(service.listWorkspaceMembers(auth("agent"))).rejects.toThrow();
    await expect(
      service.listWorkspaceMembers(auth("viewer")),
    ).rejects.toThrow();
  });

  it("returns sanitized role readiness with all mutation controls disabled", () => {
    const service = new UserRoleManagementService(
      new FixtureUserRoleManagementRepository(),
    );

    const response = service.getRoleManagementReadiness(auth("owner"));
    const serialized = JSON.stringify(response);

    expect(response.data.status).toBe("readiness_only");
    expect(response.data.policy.can_invite_users).toBe(false);
    expect(response.data.policy.can_update_roles).toBe(false);
    expect(response.data.policy.can_delete_users).toBe(false);
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain(["client", "secret"].join("_"));
    expect(serialized).not.toContain("raw_provider_payload");
  });

  it("uses backend AuthContext workspace scope, not client-provided workspaceId", async () => {
    const service = new UserRoleManagementService(
      new FixtureUserRoleManagementRepository(),
    );

    const response = await service.listWorkspaceMembers(auth("owner"));

    expect(response.data.members.map((member) => member.user_id)).toContain(
      "usr_demo_owner",
    );
    expect(
      response.data.members.some((member) => member.user_id.includes("other")),
    ).toBe(false);
  });
});
