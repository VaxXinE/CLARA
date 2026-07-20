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

describe("P10 compliance dashboard security boundary", () => {
  it("does not expose raw evidence, raw audit data, secrets, or export behavior", () => {
    const dashboard = new ComplianceDashboardService().getDashboard({ auth });
    const output = JSON.stringify(dashboard);

    expect(dashboard.safety).toMatchObject({
      exportEnabled: false,
      evidenceDownloadEnabled: false,
      rawEvidenceIncluded: false,
      rawAuditMetadataIncluded: false,
      secretsIncluded: false,
      certificationClaimed: false,
    });

    for (const forbidden of [
      "atk",
      "rtk",
      "Bearer ",
      "client secret value",
      "raw customer message",
      "raw provider body",
      "raw webhook body",
    ]) {
      expect(output).not.toContain(forbidden);
    }
  });
});
