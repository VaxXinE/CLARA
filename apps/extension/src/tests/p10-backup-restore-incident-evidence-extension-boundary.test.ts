import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P10 backup restore incident evidence extension boundary", () => {
  it("keeps operational resilience internals out of the extension", () => {
    expect(extensionBackground.syncScope).toBe("active_conversation_only");
    expect(extensionBackground.sendMode).toBe("manual_assisted");

    for (const key of [
      "backupRestoreReadiness",
      "incidentResponseReadiness",
      "evidenceReadiness",
      "operationalResilienceSummary",
      "backupInternals",
      "restoreInternals",
      "incidentResponseInternals",
      "rawComplianceEvidence",
      "crossWorkspaceEnterpriseData",
      "accessToken",
      "refreshToken",
      "authorizationHeader",
      "clientSecret",
      "apiKey",
      "providerCookie",
      "sessionCookie",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "rawEvidence",
      "rawDom",
      "rawHtml",
      "rawPrompt",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
