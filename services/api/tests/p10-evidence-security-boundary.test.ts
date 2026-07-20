import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { EvidenceReadinessService } from "../src/enterprise/evidence-readiness-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 evidence security boundary", () => {
  it("does not expose secrets, raw audit metadata, or raw evidence content", () => {
    const output = JSON.stringify(
      new EvidenceReadinessService().getReadiness({ auth }),
    );

    for (const forbidden of [
      "atk",
      "rtk",
      "Bearer ",
      "client secret value",
      "raw audit metadata body",
      "raw evidence body",
      "raw customer body",
    ]) {
      expect(output).not.toContain(forbidden);
    }
  });
});
