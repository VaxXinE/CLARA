import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { CustomerProfileIntelligenceService } from "../src/customers/customer-intelligence-service";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

describe("P8 customer intelligence service", () => {
  it("returns deterministic read-only signals from scoped fixture data", async () => {
    const store = createFixtureAppStore();
    const service = new CustomerProfileIntelligenceService(
      new FixtureCustomerRepository(store),
      new FixtureConversationRepository(store),
      () => new Date("2026-01-10T00:00:00.000Z"),
    );

    const result = await service.getCustomerProfileIntelligence({
      auth: buildAuthContext({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      customerId: "cust_demo_budi",
    });

    expect(result.activitySignals.totalConversationCount).toBeGreaterThan(0);
    expect(result.safety).toEqual({
      readOnly: true,
      mutationAllowed: false,
      requiresHumanApprovalForMutation: true,
      policyVersion: "customer-profile-intelligence-read-model-v1",
    });
  });
});
