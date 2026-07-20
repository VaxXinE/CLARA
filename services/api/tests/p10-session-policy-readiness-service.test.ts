import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { SessionPolicyReadinessService } from "../src/enterprise/session-policy-readiness-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "agent",
  permissions: [],
  authMethod: "mock",
};

describe("P10 session policy readiness service", () => {
  it("returns deterministic read-only session policy readiness", () => {
    const service = new SessionPolicyReadinessService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    );

    const readiness = service.getReadiness({ auth });

    expect(readiness.workspaceId).toBe("wks_test");
    expect(readiness.sessionPolicy).toMatchObject({
      secureCookieRequired: true,
      tokenStorageBoundaryRequired: true,
      forceLogoutImplemented: false,
      sessionRevocationImplemented: false,
      mfaStepUpImplemented: false,
    });
    expect(readiness.safety).toMatchObject({
      readOnly: true,
      sessionRevoked: false,
      forceLogoutExecuted: false,
      tokensIncluded: false,
      cookiesIncluded: false,
      authHeadersIncluded: false,
      secretsIncluded: false,
    });
  });
});
