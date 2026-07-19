import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P9 final analytics extension boundary regression", () => {
  it("keeps analytics internals out of extension capabilities", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "analyticsOverview",
      "kpiDashboard",
      "metricCatalog",
      "reportingFilters",
      "analyticsAuditTrail",
      "crossWorkspaceAnalytics",
      "customerLevelDrilldown",
      "reportExport",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
