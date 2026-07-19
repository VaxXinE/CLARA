import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P9 KPI dashboard card extension boundary", () => {
  it("keeps KPI dashboard internals out of the extension runtime", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "kpiDashboardCards",
      "analyticsDashboard",
      "customerLevelDrilldown",
      "reportExport",
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
