import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { RedactionHardeningService } from "../src/enterprise/redaction-hardening-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 redaction hardening service", () => {
  it("returns safe redaction hardening readiness", () => {
    const service = new RedactionHardeningService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    );

    const readiness = service.getReadiness({ auth });

    expect(readiness.workspaceId).toBe("wks_test");
    expect(readiness.redaction).toMatchObject({
      tokenRedactionRequired: true,
      cookieRedactionRequired: true,
      authHeaderRedactionRequired: true,
      apiKeyRedactionRequired: true,
    });
    expect(readiness.safety).toMatchObject({
      readOnly: true,
      mutationAllowed: false,
      rawBeforeAfterSamplesIncluded: false,
      secretsIncluded: false,
    });
  });
});
