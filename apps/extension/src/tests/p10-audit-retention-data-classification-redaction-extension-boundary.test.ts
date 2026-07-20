import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P10 audit retention, data classification, and redaction extension boundary", () => {
  it("does not expose compliance internals or sensitive material to the extension", () => {
    expect(extensionBackground.syncScope).toBe("active_conversation_only");
    expect(extensionBackground.sendMode).toBe("manual_assisted");

    for (const key of [
      "auditRetentionReadiness",
      "dataClassificationReadiness",
      "redactionHardeningReadiness",
      "complianceInternals",
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
      "rawCustomerMessage",
      "rawDom",
      "rawHtml",
      "rawPrompt",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
