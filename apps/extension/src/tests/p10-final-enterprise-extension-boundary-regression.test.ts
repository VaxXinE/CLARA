import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P10 final enterprise extension boundary regression", () => {
  it("keeps enterprise compliance internals out of extension capabilities", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "backupRestoreReadiness",
      "incidentResponseReadiness",
      "evidenceReadiness",
      "operationalResilience",
      "complianceEvidence",
      "rawEvidence",
      "rawPermissionInternals",
      "crossWorkspaceEnterpriseAccess",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
