import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { PerformanceCapacityReadinessService } from "../src/reliability/performance-readiness-service";

const auth = buildAuthContext({
  userId: "usr_p11_perf",
  organizationId: "org_p11",
  workspaceId: "wks_p11",
  role: "owner",
});

describe("P11 final performance no heavy load regression", () => {
  it("documents capacity readiness without executing load tests", () => {
    const readiness = new PerformanceCapacityReadinessService().getReadiness({
      auth,
    });

    expect(readiness.performanceReadiness).toMatchObject({
      heavyLoadTestExecutedByDefault: false,
      productionTargetAllowed: false,
    });
    expect(readiness.loadTestReadiness).toMatchObject({
      ciHeavyLoadExecutionEnabled: false,
      externalProviderCallsAllowed: false,
    });
    expect(readiness.safety).toMatchObject({
      loadTestExecuted: false,
      benchmarkExecuted: false,
      productionTargeted: false,
      providerCalled: false,
      paymentProviderCalled: false,
      aiProviderCalled: false,
      outboundSent: false,
      secretsIncluded: false,
    });
  });
});
