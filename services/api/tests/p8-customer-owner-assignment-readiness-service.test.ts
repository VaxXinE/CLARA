import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { CustomerOwnerAssignmentReadinessService } from "../src/customers/customer-owner-assignment-readiness-service";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P8 customer owner assignment readiness service", () => {
  it("returns deterministic review-only owner assignment readiness", async () => {
    const service = new CustomerOwnerAssignmentReadinessService(
      new FixtureCustomerRepository(createFixtureAppStore()),
      () => new Date("2026-01-10T00:00:00.000Z"),
    );

    const result = await service.getReadiness({
      auth,
      customerId: "cust_demo_budi",
      reviewContext: {
        note: "Review owner handoff.",
      },
    });

    expect(result).toMatchObject({
      customerId: "cust_demo_budi",
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-01-10T00:00:00.000Z",
      readiness: {
        level: "ready_for_review",
      },
      currentOwnership: {
        hasOwner: false,
        ownerId: null,
        ownerRole: null,
      },
      suggestedAssignment: {
        executionStatus: "review_only",
        ownerAssigned: false,
        requiresHumanApproval: true,
      },
      safety: {
        readOnly: true,
        proposalOnly: true,
        ownerAssigned: false,
        mutationAllowed: false,
        actionExecuted: false,
      },
    });
  });

  it("blocks unsafe input without returning secret material", async () => {
    const service = new CustomerOwnerAssignmentReadinessService(
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
    expect(result.suggestedAssignment.recommendedAction).toBe("no_op");
    expect(result.suggestedAssignment.ownerAssigned).toBe(false);
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
  });
});
