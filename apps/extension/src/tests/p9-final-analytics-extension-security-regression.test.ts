import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P9 final analytics extension security regression", () => {
  it("does not expose analytics secrets, raw payloads, DOM, HTML, prompts, or mutation/send controls", () => {
    for (const key of [
      "accessToken",
      "refreshToken",
      "authorizationHeader",
      "providerCookie",
      "sessionCookie",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "rawCustomerMessages",
      "rawDom",
      "rawHtml",
      "rawPrompt",
      "createTask",
      "sendOutbound",
      "executeWorkflow",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
