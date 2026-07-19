import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P9 CRM workflow metrics extension boundary", () => {
  it("keeps CRM workflow analytics out of the extension runtime", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "crmWorkflowMetrics",
      "crmWorkflowKpis",
      "crossWorkspaceAnalytics",
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
