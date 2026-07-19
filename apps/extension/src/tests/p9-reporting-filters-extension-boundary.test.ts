import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P9 reporting filters extension boundary", () => {
  it("keeps reporting filters out of the browser extension runtime", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "reportingFilters",
      "operatorAnalyticsFilter",
      "crossWorkspaceAnalytics",
      "customerLevelDrilldown",
      "reportExport",
      "metricRawData",
      "accessToken",
      "refreshToken",
      "providerCookie",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "rawDom",
      "rawHtml",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
