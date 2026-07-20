import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { AuditRetentionReadinessService } from "../src/enterprise/audit-retention-readiness-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 audit retention readiness service", () => {
  it("returns deterministic workspace-scoped readiness without executing retention actions", () => {
    const service = new AuditRetentionReadinessService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    );

    const readiness = service.getReadiness({ auth });

    expect(readiness.workspaceId).toBe("wks_test");
    expect(readiness.generatedAt).toBe("2026-07-20T00:00:00.000Z");
    expect(readiness.retentionReadiness).toMatchObject({
      auditRetentionPolicyDefined: true,
      deletionAutomationImplemented: false,
      legalHoldAutomationImplemented: false,
      retentionJobImplemented: false,
      exportImplemented: false,
    });
    expect(readiness.safety).toMatchObject({
      readOnly: true,
      deletionExecuted: false,
      legalHoldExecuted: false,
      exportExecuted: false,
      secretsIncluded: false,
    });
  });
});
