import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { toComplianceDashboardDto } from "../src/enterprise/compliance-dashboard-dto";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 final enterprise compliance readiness", () => {
  it("marks final P10 readiness as implemented without claiming certification", () => {
    const dto = toComplianceDashboardDto({
      auth,
      generatedAt: new Date("2026-07-20T00:00:00.000Z"),
    });

    expect(dto.readinessSummary.finalP10AuditImplemented).toBe(true);
    expect(dto.safety).toMatchObject({
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
