import { describe, expect, it } from "vitest";
import { getPermissionAuditRoleBoundaries } from "../src/enterprise/permission-audit-policy";

describe("P10 permission audit policy", () => {
  it("represents role boundaries with denied access audit requirements", () => {
    const boundaries = getPermissionAuditRoleBoundaries();
    const viewer = boundaries.find((boundary) => boundary.role === "viewer");

    expect(boundaries).toHaveLength(3);
    expect(viewer).toMatchObject({
      auditRequiredForDeniedAccess: true,
      mutationAllowed: false,
    });
    expect(viewer?.deniedSurfaceKeys).toContain("reply_send");
    expect(viewer?.deniedSurfaceKeys).toContain("permission_mutation");
  });
});
