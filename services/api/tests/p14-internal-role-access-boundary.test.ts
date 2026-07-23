import { describe, expect, it } from "vitest";
import { getPermissionsForRole } from "../src/auth/permissions";
import { getUserRoleManagementPolicy } from "../src/auth/user-role-management-policy";

describe("P14 internal role access boundary", () => {
  it("keeps owner/admin/operator/viewer boundaries explicit", () => {
    expect(getPermissionsForRole("owner")).toContain("customer:update");
    expect(getPermissionsForRole("agent")).toContain("customer:update");
    expect(getPermissionsForRole("viewer")).not.toContain("customer:update");
    expect(getPermissionsForRole("viewer")).not.toContain("customer:create");

    expect(getUserRoleManagementPolicy("owner").can_read_members).toBe(true);
    expect(getUserRoleManagementPolicy("agent").can_read_members).toBe(false);
    expect(getUserRoleManagementPolicy("viewer").can_read_members).toBe(false);
  });
});
