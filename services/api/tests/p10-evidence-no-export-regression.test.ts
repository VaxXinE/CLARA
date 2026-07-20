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

describe("P10 evidence no export regression", () => {
  it("does not export, download, or expose raw evidence", () => {
    const readiness = new EvidenceReadinessService().getReadiness({ auth });

    expect(readiness.evidenceReadiness.rawEvidenceBrowsingImplemented).toBe(
      false,
    );
    expect(readiness.evidenceReadiness.evidenceExportImplemented).toBe(false);
    expect(readiness.evidenceReadiness.evidenceDownloadImplemented).toBe(false);
    expect(readiness.safety.rawEvidenceIncluded).toBe(false);
  });
});
