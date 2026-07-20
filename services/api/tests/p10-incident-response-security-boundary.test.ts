import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { IncidentResponseReadinessService } from "../src/enterprise/incident-response-readiness-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 incident response security boundary", () => {
  it("does not expose secrets or raw incident evidence", () => {
    const output = JSON.stringify(
      new IncidentResponseReadinessService().getReadiness({ auth }),
    );

    for (const forbidden of [
      "atk",
      "rtk",
      "Bearer ",
      "client secret value",
      "raw customer body",
      "provider raw body",
      "webhook raw body",
    ]) {
      expect(output).not.toContain(forbidden);
    }
  });
});
