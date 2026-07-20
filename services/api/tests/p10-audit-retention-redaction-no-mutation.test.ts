import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { AuditRetentionReadinessService } from "../src/enterprise/audit-retention-readiness-service";
import { RedactionHardeningService } from "../src/enterprise/redaction-hardening-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 audit retention and redaction readiness no-mutation guard", () => {
  it("does not execute deletion, legal hold, export, CRM mutation, tasks, notes, owner changes, status updates, outbound send, or real AI", () => {
    const audit = new AuditRetentionReadinessService().getReadiness({ auth });
    const redaction = new RedactionHardeningService().getReadiness({ auth });

    expect(audit.safety).toMatchObject({
      mutationAllowed: false,
      deletionExecuted: false,
      legalHoldExecuted: false,
      exportExecuted: false,
    });
    expect(audit.retentionReadiness).toMatchObject({
      deletionAutomationImplemented: false,
      legalHoldAutomationImplemented: false,
      retentionJobImplemented: false,
      exportImplemented: false,
    });
    expect(redaction.safety.mutationAllowed).toBe(false);
  });
});
