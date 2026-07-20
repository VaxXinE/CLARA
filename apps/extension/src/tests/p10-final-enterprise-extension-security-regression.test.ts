import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P10 final enterprise extension security regression", () => {
  it("does not expose secrets, raw browser/session data, or enterprise automation", () => {
    for (const key of [
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
      "executeBackup",
      "executeRestore",
      "exportEvidence",
      "sendNotification",
      "sendOutbound",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
