import { describe, expect, it } from "vitest";
import { PerformanceCapacityReadinessService } from "../src/reliability/performance-readiness-service";
import { buildAuthContext } from "../src/auth/auth-context";

describe("P11 performance no heavy load regression", () => {
  it("does not execute load tests or benchmark jobs from readiness", () => {
    const readiness = new PerformanceCapacityReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });

    expect(readiness.safety.loadTestExecuted).toBe(false);
    expect(readiness.safety.benchmarkExecuted).toBe(false);
    expect(readiness.loadTestReadiness.ciHeavyLoadExecutionEnabled).toBe(false);
  });
});
