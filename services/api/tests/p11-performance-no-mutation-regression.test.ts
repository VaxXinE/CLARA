import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { PerformanceCapacityReadinessService } from "../src/reliability/performance-readiness-service";

describe("P11 performance no mutation regression", () => {
  it("has no CRM, billing, provider, AI, or outbound side effects", () => {
    const readiness = new PerformanceCapacityReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
    });

    expect(readiness.safety).toMatchObject({
      mutationAllowed: false,
      providerCalled: false,
      paymentProviderCalled: false,
      aiProviderCalled: false,
      outboundSent: false,
    });
  });
});
