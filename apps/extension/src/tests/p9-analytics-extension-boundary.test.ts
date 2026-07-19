import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P9 analytics extension boundary", () => {
  it("keeps the extension out of analytics internals", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "analyticsMode",
      "workspaceAnalytics",
      "crossWorkspaceAnalytics",
      "rawKpiData",
      "accessToken",
      "refreshToken",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
