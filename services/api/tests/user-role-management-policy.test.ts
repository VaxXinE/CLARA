import { describe, expect, it } from "vitest";
import {
  assertCanReadUserRoleManagement,
  getUserRoleManagementPolicy,
} from "../src/auth/user-role-management-policy";

describe("user role management policy", () => {
  it("allows owner to read readiness and members", () => {
    expect(getUserRoleManagementPolicy("owner")).toMatchObject({
      can_read_members: true,
      can_read_readiness: true,
      can_invite_users: false,
      can_update_roles: false,
      can_delete_users: false,
      mutation_status: "not_implemented",
    });
    expect(() => assertCanReadUserRoleManagement("owner")).not.toThrow();
  });

  it("blocks agent and viewer from role management readiness", () => {
    expect(getUserRoleManagementPolicy("agent").can_read_members).toBe(false);
    expect(getUserRoleManagementPolicy("viewer").can_read_members).toBe(false);
    expect(() => assertCanReadUserRoleManagement("agent")).toThrow();
    expect(() => assertCanReadUserRoleManagement("viewer")).toThrow();
  });
});
