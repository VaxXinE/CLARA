import source from "./AnalyticsReadModelFoundationPanel.tsx?raw";
import readinessSource from "./AnalyticsReportingReadinessPanel.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P9 analytics read model foundation dashboard security", () => {
  it("does not add unsafe rendering, secret display, or mutation controls", () => {
    const combinedSource = `${source}\n${readinessSource}`;

    for (const pattern of [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "Authorization",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
      "rawPrompt",
      ">Export<",
      ">Download<",
      ">Execute<",
      ">Apply<",
      ">Create Task<",
      ">Assign Owner<",
      ">Update Status<",
      ">Send Message<",
      ">Write Note<",
    ]) {
      expect(combinedSource).not.toContain(pattern);
    }
  });
});
