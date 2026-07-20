import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { AuditRetentionReadinessService } from "../src/enterprise/audit-retention-readiness-service";
import { DataClassificationRuntimeService } from "../src/enterprise/data-classification-runtime-service";
import { RedactionHardeningService } from "../src/enterprise/redaction-hardening-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 audit retention and redaction security boundary", () => {
  it("does not include sensitive sample values or raw payloads in readiness output", () => {
    const clock = () => new Date("2026-07-20T00:00:00.000Z");
    const output = JSON.stringify([
      new AuditRetentionReadinessService(clock).getReadiness({ auth }),
      new DataClassificationRuntimeService(clock).getReadiness({ auth }),
      new RedactionHardeningService(clock).getReadiness({ auth }),
    ]);

    for (const forbidden of [
      "atk",
      "rtk",
      "Bearer ",
      "client secret value",
      "provider raw error body",
      "customer message body",
      "webhook body",
    ]) {
      expect(output).not.toContain(forbidden);
    }
  });
});
