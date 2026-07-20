import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { AdminSecurityControlsService } from "../src/enterprise/admin-security-controls-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 admin security controls no-mutation guard", () => {
  it("does not implement role, permission, SSO, or MFA mutation", () => {
    const readiness = new AdminSecurityControlsService().getReadiness({ auth });

    expect(readiness.adminSecurity).toMatchObject({
      roleMutationImplemented: false,
      permissionMutationImplemented: false,
      ssoImplemented: false,
      mfaImplemented: false,
    });
    expect(readiness.safety).toMatchObject({
      mutationAllowed: false,
      roleMutationAllowed: false,
      permissionMutationAllowed: false,
    });
  });
});
