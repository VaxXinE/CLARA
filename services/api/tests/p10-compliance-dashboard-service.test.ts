import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { ComplianceDashboardService } from "../src/enterprise/compliance-dashboard-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 compliance dashboard service", () => {
  it("returns deterministic dashboard readiness without evidence export", () => {
    const service = new ComplianceDashboardService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    );

    const dashboard = service.getDashboard({ auth });

    expect(dashboard.workspaceId).toBe("wks_test");
    expect(dashboard.readinessSummary).toMatchObject({
      adminSecurityControlsReady: true,
      sessionPolicyReady: true,
      evidenceReadinessImplemented: true,
      incidentResponseImplemented: true,
      backupRestoreImplemented: true,
      finalP10AuditImplemented: false,
    });
    expect(dashboard.safety).toMatchObject({
      readOnly: true,
      exportEnabled: false,
      evidenceDownloadEnabled: false,
      rawEvidenceIncluded: false,
      rawAuditMetadataIncluded: false,
      secretsIncluded: false,
      certificationClaimed: false,
    });
  });
});
