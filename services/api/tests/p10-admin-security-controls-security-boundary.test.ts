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

describe("P10 admin security controls security boundary", () => {
  it("does not expose sensitive values or raw permission internals", () => {
    const output = JSON.stringify(
      new AdminSecurityControlsService().getReadiness({ auth }),
    );

    for (const forbidden of [
      "atk",
      "rtk",
      "Bearer ",
      "client secret value",
      "raw permission graph",
      "provider raw body",
    ]) {
      expect(output).not.toContain(forbidden);
    }
  });
});
