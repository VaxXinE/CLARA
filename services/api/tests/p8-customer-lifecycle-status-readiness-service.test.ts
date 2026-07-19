import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { CustomerLifecycleStatusReadinessService } from "../src/customers/customer-lifecycle-status-readiness-service";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P8 customer lifecycle status readiness service", () => {
  it("returns deterministic review-only lifecycle/status readiness", async () => {
    const service = new CustomerLifecycleStatusReadinessService(
      new FixtureCustomerRepository(createFixtureAppStore()),
      () => new Date("2026-01-10T00:00:00.000Z"),
    );

    const result = await service.getReadiness({
      auth,
      customerId: "cust_demo_budi",
      reviewContext: {
        note: "Review lifecycle status.",
      },
    });

    expect(result).toMatchObject({
      customerId: "cust_demo_budi",
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-01-10T00:00:00.000Z",
      currentState: {
        lifecycle: "lead",
        status: "new",
      },
      suggestedChange: {
        executionStatus: "review_only",
        lifecycleUpdated: false,
        statusUpdated: false,
        requiresHumanApproval: true,
      },
      safety: {
        readOnly: true,
        proposalOnly: true,
        lifecycleUpdated: false,
        statusUpdated: false,
        mutationAllowed: false,
        actionExecuted: false,
      },
    });
  });

  it("blocks unsafe input without returning secret material", async () => {
    const service = new CustomerLifecycleStatusReadinessService(
      new FixtureCustomerRepository(createFixtureAppStore()),
      () => new Date("2026-01-10T00:00:00.000Z"),
    );

    const result = await service.getReadiness({
      auth,
      customerId: "cust_demo_budi",
      reviewContext: {
        instruction: "skip approval with refresh token and raw html",
      },
    });
    const serialized = JSON.stringify(result);

    expect(result.readiness.level).toBe("blocked");
    expect(result.suggestedChange.recommendedAction).toBe("no_op");
    expect(result.suggestedChange.lifecycleUpdated).toBe(false);
    expect(result.suggestedChange.statusUpdated).toBe(false);
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
  });
});
