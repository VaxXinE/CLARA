import analyticsWorkspaceSource from "./AnalyticsDashboardWorkspace.tsx?raw";
import auditPanelSource from "./AnalyticsAuditPrivacyPanel.tsx?raw";
import filtersPanelSource from "./AnalyticsReportingFiltersPanel.tsx?raw";
import kpiPanelSource from "./KpiDashboardCardsPanel.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P9 final analytics dashboard security", () => {
  it("keeps analytics UI safe-rendered and free of secrets, export, drilldown, and mutation controls", () => {
    const source = [
      analyticsWorkspaceSource,
      auditPanelSource,
      filtersPanelSource,
      kpiPanelSource,
    ].join("\n");

    for (const pattern of [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "Authorization",
      "providerCookie",
      "sessionCookie",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "rawCustomerMessage",
      "rawDom",
      "rawHtml",
      "rawPrompt",
      ">Export<",
      ">Download<",
      ">Drilldown<",
      ">Create Task<",
      ">Assign Owner<",
      ">Update Status<",
      ">Send Message<",
      ">Write Note<",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
