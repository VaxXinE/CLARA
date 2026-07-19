import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P10 enterprise compliance extension boundary", () => {
  it("keeps extension out of enterprise compliance internals and sensitive material", () => {
    expect(extensionBackground.syncScope).toBe("active_conversation_only");

    for (const key of [
      "enterpriseCompliance",
      "auditEvidence",
      "tenantIsolationInternals",
      "complianceEvidence",
      "accessToken",
      "refreshToken",
      "authorizationHeader",
      "providerCookie",
      "sessionCookie",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
      "rawPrompt",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
