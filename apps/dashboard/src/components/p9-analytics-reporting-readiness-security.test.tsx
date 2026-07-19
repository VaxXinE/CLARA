import source from "./AnalyticsReportingReadinessPanel.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P9 analytics reporting readiness dashboard security", () => {
  it("does not render unsafe analytics internals or mutation controls", () => {
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
      ">Execute<",
      ">Apply<",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
