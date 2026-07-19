import filtersPanelSource from "./AnalyticsReportingFiltersPanel.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P9 reporting filters dashboard security", () => {
  it("does not add raw data rendering, export controls, or mutation controls", () => {
    for (const pattern of [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "Authorization",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "rawDom",
      "rawHtml",
      "rawPrompt",
      ">Export<",
      ">Download<",
      ">Create Task<",
      ">Assign Owner<",
      ">Update Status<",
      ">Send Message<",
      ">Write Note<",
    ]) {
      expect(filtersPanelSource).not.toContain(pattern);
    }
  });
});
