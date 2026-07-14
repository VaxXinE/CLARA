import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { UserRoleManagementService } from "../src/auth/user-role-management-service";
import { FixtureUserRoleManagementRepository } from "../src/auth/user-role-management-repository";

function auth(role: "owner" | "agent" | "viewer") {
  return buildAuthContext({
    userId: `usr_demo_${role}`,
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role,
  });
}

function expectSafe(value: unknown): void {
  const serialized = JSON.stringify(value);

  expect(serialized).not.toContain("access_token");
  expect(serialized).not.toContain("refresh_token");
  expect(serialized).not.toContain("Authorization");
  expect(serialized).not.toContain(["client", "secret"].join("_"));
  expect(serialized).not.toContain("raw provider");
}

describe("UserRoleManagementService", () => {
  it("lists workspace members for owner using AuthContext scope", async () => {
    const service = new UserRoleManagementService(
      new FixtureUserRoleManagementRepository(),
    );

    const response = await service.listWorkspaceMembers(auth("owner"));

    expect(response.data.members.map((member) => member.user_id)).toEqual([
      "usr_demo_owner",
      "usr_demo_agent",
      "usr_demo_viewer",
      "usr_demo_inactive_membership",
    ]);
    expect(response.permissions).toMatchObject({
      can_read_members: true,
      can_invite_users: false,
      can_update_roles: false,
      can_delete_users: false,
    });
    expectSafe(response);
  });

  it("returns readiness without enabling mutations", () => {
    const service = new UserRoleManagementService(
      new FixtureUserRoleManagementRepository(),
    );

    const response = service.getRoleManagementReadiness(auth("owner"));

    expect(response.data).toMatchObject({
      status: "readiness_only",
      workspace_id: "wks_demo_sales",
      current_user: {
        id: "usr_demo_owner",
        role: "owner",
      },
      disabled_controls: ["invite_user", "update_role", "delete_user"],
    });
    expect(response.data.policy.can_invite_users).toBe(false);
    expectSafe(response);
  });

  it("fails closed for non-owner roles", async () => {
    const service = new UserRoleManagementService(
      new FixtureUserRoleManagementRepository(),
    );

    await expect(service.listWorkspaceMembers(auth("agent"))).rejects.toThrow();
    expect(() => service.getRoleManagementReadiness(auth("viewer"))).toThrow();
  });
});
