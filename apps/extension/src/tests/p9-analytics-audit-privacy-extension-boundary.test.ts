import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P9 analytics audit privacy extension boundary", () => {
  it("does not collect analytics audit internals in the extension", () => {
    for (const key of [
      "analyticsAuditTrail",
      "rawAuditMetadata",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawCustomerMessages",
      "accessToken",
      "refreshToken",
      "authorizationHeader",
      "cookieJar",
      "rawDom",
      "rawHtml",
      "rawPrompt",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
