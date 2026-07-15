import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerProfileIntelligenceService } from "../src/customers/customer-intelligence-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

function expectSafe(value: unknown): void {
  const serialized = JSON.stringify(value);

  expect(serialized).not.toContain("access_token");
  expect(serialized).not.toContain("refresh_token");
  expect(serialized).not.toContain("Authorization");
  expect(serialized).not.toContain(["client", "secret"].join("_"));
  expect(serialized).not.toContain("raw Gmail payload");
  expect(serialized).not.toContain("raw_provider_payload");
}

describe("CustomerProfileIntelligenceService", () => {
  it("builds a read-only customer intelligence DTO from scoped safe data", async () => {
    const store = createFixtureAppStore();
    const service = new CustomerProfileIntelligenceService(
      new FixtureCustomerRepository(store),
      new FixtureConversationRepository(store),
      () => new Date("2026-01-10T00:00:00.000Z"),
    );

    const result = await service.getCustomerProfileIntelligence({
      auth,
      customerId: "cust_demo_budi",
    });

    expect(result).toMatchObject({
      customerId: "cust_demo_budi",
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-01-10T00:00:00.000Z",
      profileHealth: {
        level: "needs_attention",
      },
      activitySignals: {
        openConversationCount: 1,
        totalConversationCount: 1,
        recentActivityCount: 1,
      },
      followUpSignals: {
        recommendedAction: "follow_up",
        urgency: "high",
      },
      safety: {
        readOnly: true,
        mutationAllowed: false,
        requiresHumanApprovalForMutation: true,
      },
    });
    expectSafe(result);
  });

  it("fails closed for cross-workspace customer access", async () => {
    const store = createFixtureAppStore();
    const service = new CustomerProfileIntelligenceService(
      new FixtureCustomerRepository(store),
      new FixtureConversationRepository(store),
    );

    await expect(
      service.getCustomerProfileIntelligence({
        auth,
        customerId: "cust_other_workspace",
      }),
    ).rejects.toThrow("Customer not found.");
  });
});
