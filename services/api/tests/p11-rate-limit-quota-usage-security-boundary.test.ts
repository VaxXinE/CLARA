import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { RateLimitQuotaUsageReadinessService } from "../src/reliability/rate-limit-readiness-service";

describe("P11 rate limit quota usage security boundary", () => {
  it("returns safe aggregate output without raw payloads or secrets", () => {
    const readiness = new RateLimitQuotaUsageReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
    });
    const serialized = JSON.stringify(readiness);

    expect(readiness.usageSummary).toMatchObject({
      aggregateOnly: true,
      rawUsageEventsIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
    });
    expect(serialized).not.toContain("Bearer ");
    expect(serialized).not.toContain("client_secret");
    expect(serialized).not.toContain("providerCookie");
    expect(serialized).not.toContain("sessionCookie");
    expect(serialized).not.toContain("raw audit metadata");
  });
});
