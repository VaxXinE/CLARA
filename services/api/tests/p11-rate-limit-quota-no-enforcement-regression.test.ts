import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { RateLimitQuotaUsageReadinessService } from "../src/reliability/rate-limit-readiness-service";

describe("P11 rate limit quota no enforcement regression", () => {
  it("does not enable quota blocking or usage counter mutation", () => {
    const readiness = new RateLimitQuotaUsageReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });

    expect(
      readiness.rateLimitReadiness.productionQuotaBlockingImplemented,
    ).toBe(false);
    expect(readiness.quotaReadiness.quotaEnforcementImplemented).toBe(false);
    expect(readiness.safety.quotaEnforced).toBe(false);
    expect(readiness.safety.usageCounterMutated).toBe(false);
  });
});
