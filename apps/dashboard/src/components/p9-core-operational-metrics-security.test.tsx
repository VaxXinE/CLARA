import source from "./CoreOperationalMetricsPanel.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P9 core operational metrics dashboard security", () => {
  it("does not add unsafe rendering, secret display, or mutation controls", () => {
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
      expect(source).not.toContain(pattern);
    }
  });
});
