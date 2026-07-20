import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { RateLimitQuotaUsageReadinessService } from "../src/reliability/rate-limit-readiness-service";

describe("P11 rate limit quota usage readiness service", () => {
  it("returns deterministic workspace-scoped readiness", () => {
    const readiness = new RateLimitQuotaUsageReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
      generatedAt: new Date("2026-07-20T00:00:00.000Z"),
    });

    expect(readiness).toMatchObject({
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-20T00:00:00.000Z",
      phase: "p11",
      rateLimitReadiness: {
        safe429BehaviorDefined: true,
        productionQuotaBlockingImplemented: false,
      },
      quotaReadiness: {
        quotaPolicyDefined: true,
        quotaEnforcementImplemented: false,
      },
      usageMeteringReadiness: {
        aggregateUsageDefined: true,
        rawUsageEventsExposed: false,
        invoiceCreationImplemented: false,
        chargingImplemented: false,
      },
      usageSummary: {
        aggregateOnly: true,
        workspaceScoped: true,
        safeBillingMetadataOnly: true,
      },
      safety: {
        readOnly: true,
        mutationAllowed: false,
        customerCharged: false,
        invoiceCreated: false,
        paymentProviderCalled: false,
      },
    });
  });
});
