import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { SessionPolicyReadinessService } from "../src/enterprise/session-policy-readiness-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 session policy no-revocation regression", () => {
  it("does not revoke sessions, force logout, or return token material", () => {
    const readiness = new SessionPolicyReadinessService().getReadiness({
      auth,
    });

    expect(readiness.sessionPolicy).toMatchObject({
      forceLogoutImplemented: false,
      sessionRevocationImplemented: false,
    });
    expect(readiness.safety).toMatchObject({
      sessionRevoked: false,
      forceLogoutExecuted: false,
      tokensIncluded: false,
      cookiesIncluded: false,
      authHeadersIncluded: false,
    });
  });
});
