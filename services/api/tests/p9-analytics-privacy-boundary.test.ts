import { describe, expect, it } from "vitest";
import {
  analyticsPrivacyDefaults,
  containsUnsafeAnalyticsRequest,
} from "../src/analytics/analytics-privacy-policy";

describe("P9 analytics privacy boundary", () => {
  it("keeps metric output aggregate-first and workspace-scoped", () => {
    expect(analyticsPrivacyDefaults).toEqual({
      aggregated: true,
      rawPayloadIncluded: false,
      piiMinimized: true,
      workspaceScoped: true,
      policyVersion: "p9-analytics-kpi-policy-v1",
    });
  });

  it("blocks raw payload, secret, and unminimized data requests", () => {
    for (const payload of [
      { field: "access_token" },
      { field: "refresh_token" },
      { field: "Authorization header" },
      { field: "provider payload" },
      { field: "webhook payload" },
      { field: "customer message" },
      { field: "raw HTML" },
      { field: "raw prompt" },
    ]) {
      expect(containsUnsafeAnalyticsRequest(payload)).toBe(true);
    }
  });
});
