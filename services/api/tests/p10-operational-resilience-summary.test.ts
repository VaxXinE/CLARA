import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { BackupRestoreReadinessService } from "../src/enterprise/backup-restore-readiness-service";
import { EvidenceReadinessService } from "../src/enterprise/evidence-readiness-service";
import { IncidentResponseReadinessService } from "../src/enterprise/incident-response-readiness-service";
import { summarizeOperationalResilience } from "../src/enterprise/operational-resilience-summary";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 operational resilience summary", () => {
  it("summarizes readiness without claiming certification or execution", () => {
    const summary = summarizeOperationalResilience({
      backupRestore: new BackupRestoreReadinessService().getReadiness({ auth }),
      incidentResponse: new IncidentResponseReadinessService().getReadiness({
        auth,
      }),
      evidence: new EvidenceReadinessService().getReadiness({ auth }),
    });

    expect(summary).toEqual({
      phase: "p10",
      backupRestoreReady: true,
      incidentResponseReady: true,
      evidenceReadinessReady: true,
      complianceReadinessOnly: true,
      certificationClaimed: false,
      automationExecuted: false,
    });
  });
});
