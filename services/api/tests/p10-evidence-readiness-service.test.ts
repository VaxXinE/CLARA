import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { EvidenceReadinessService } from "../src/enterprise/evidence-readiness-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 evidence readiness service", () => {
  it("returns safe workspace-scoped evidence readiness", () => {
    const readiness = new EvidenceReadinessService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    ).getReadiness({ auth });

    expect(readiness).toMatchObject({
      workspaceId: "wks_test",
      generatedAt: "2026-07-20T00:00:00.000Z",
      evidenceReadiness: {
        safeEvidenceSummaryOnly: true,
        evidenceExportImplemented: false,
        evidenceDownloadImplemented: false,
        certificationClaimed: false,
      },
      safety: {
        readOnly: true,
        exportEnabled: false,
        downloadEnabled: false,
      },
    });
  });
});
