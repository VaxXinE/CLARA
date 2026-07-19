import source from "./AnalyticsDashboardWorkspace.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P9 analytics dashboard workspace security", () => {
  it("keeps the analytics workspace read-only and plain text rendered", () => {
    for (const pattern of [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "Authorization",
      "rawProviderPayload",
      "rawWebhookPayload",
      ">Export<",
      ">Download<",
      ">Send Message<",
      ">Create Task<",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
