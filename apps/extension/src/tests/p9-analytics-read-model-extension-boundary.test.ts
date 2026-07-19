import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P9 analytics read model extension boundary", () => {
  it("keeps analytics read model data out of the browser extension", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "analyticsReadModel",
      "metricCatalog",
      "metricRawData",
      "crossWorkspaceAnalytics",
      "accessToken",
      "refreshToken",
      "providerCookie",
      "sessionCookie",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
