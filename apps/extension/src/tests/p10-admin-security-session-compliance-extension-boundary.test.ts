import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P10 admin security session compliance extension boundary", () => {
  it("keeps admin, session, and compliance readiness internals out of the extension", () => {
    expect(extensionBackground.syncScope).toBe("active_conversation_only");
    expect(extensionBackground.sendMode).toBe("manual_assisted");

    for (const key of [
      "adminSecurityControlsReadiness",
      "sessionPolicyReadiness",
      "complianceDashboard",
      "adminSecurityInternals",
      "sessionPolicyInternals",
      "complianceDashboardInternals",
      "complianceEvidence",
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
      "rawDom",
      "rawHtml",
      "rawPrompt",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
