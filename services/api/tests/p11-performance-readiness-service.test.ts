import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { PerformanceCapacityReadinessService } from "../src/reliability/performance-readiness-service";

describe("P11 performance readiness service", () => {
  it("returns deterministic workspace-scoped readiness without running benchmarks", () => {
    const readiness = new PerformanceCapacityReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
      generatedAt: new Date("2026-07-21T00:00:00.000Z"),
    });

    expect(readiness).toMatchObject({
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-21T00:00:00.000Z",
      phase: "p11",
      performanceReadiness: {
        latencyTargetDefined: true,
        heavyLoadTestExecutedByDefault: false,
        productionTargetAllowed: false,
      },
      loadTestReadiness: {
        ciHeavyLoadExecutionEnabled: false,
        externalProviderCallsAllowed: false,
      },
      capacityPlanning: {
        capacityBaselineDefined: true,
      },
      safety: {
        readOnly: true,
        loadTestExecuted: false,
        benchmarkExecuted: false,
        productionTargeted: false,
      },
    });
  });
});
