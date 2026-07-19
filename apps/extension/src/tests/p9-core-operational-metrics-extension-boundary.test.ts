import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P9 core operational metrics extension boundary", () => {
  it("keeps operational analytics out of the extension runtime", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "coreOperationalMetrics",
      "conversationVolumeMetrics",
      "responseTimeSlaMetrics",
      "channelPerformanceMetrics",
      "metricRawData",
      "crossWorkspaceAnalytics",
      "accessToken",
      "refreshToken",
      "providerCookie",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
