import auditPanelSource from "./AnalyticsAuditPrivacyPanel.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P9 analytics audit privacy dashboard security", () => {
  it("keeps analytics audit display aggregate and sanitized", () => {
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
      ">Apply<",
      ">Execute<",
      ">Create Task<",
      ">Send Message<",
    ]) {
      expect(auditPanelSource).not.toContain(pattern);
    }
  });
});
