import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P13 internal dashboard analytics extension boundary", () => {
  it("does not expose internal dashboard analytics APIs to the extension", () => {
    const methodNames = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methodNames).not.toContain("getInternalCrmDashboardAnalytics");
    expect(methodNames).not.toContain("getAnalyticsExport");
    expect(methodNames).not.toContain("getBillingAnalytics");
  });
});
