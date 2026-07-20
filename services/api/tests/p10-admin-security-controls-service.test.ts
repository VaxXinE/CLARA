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

describe("P10 admin security controls service", () => {
  it("returns deterministic read-only admin security readiness", () => {
    const service = new AdminSecurityControlsService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    );

    const readiness = service.getReadiness({ auth });

    expect(readiness.workspaceId).toBe("wks_test");
    expect(readiness.generatedAt).toBe("2026-07-20T00:00:00.000Z");
    expect(readiness.adminSecurity).toMatchObject({
      backendAuthorizationRequired: true,
      leastPrivilegeRequired: true,
      roleMutationImplemented: false,
      permissionMutationImplemented: false,
      ssoImplemented: false,
      mfaImplemented: false,
    });
    expect(readiness.safety).toMatchObject({
      readOnly: true,
      mutationAllowed: false,
      roleMutationAllowed: false,
      permissionMutationAllowed: false,
      secretsIncluded: false,
    });
  });
});
