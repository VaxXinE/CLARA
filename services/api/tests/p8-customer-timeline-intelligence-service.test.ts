import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { CustomerTimelineIntelligenceService } from "../src/customers/customer-timeline-intelligence-service";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

describe("P8 customer timeline intelligence service", () => {
  it("returns deterministic read-only timeline events from scoped data", async () => {
    const store = createFixtureAppStore();
    const service = new CustomerTimelineIntelligenceService(
      new FixtureCustomerRepository(store),
      new FixtureConversationRepository(store),
      () => new Date("2026-01-10T00:00:00.000Z"),
    );

    const result = await service.getCustomerTimelineIntelligence({
      auth: buildAuthContext({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      customerId: "cust_demo_budi",
    });

    expect(result.customerId).toBe("cust_demo_budi");
    expect(result.workspaceId).toBe("wks_demo_sales");
    expect(result.generatedAt).toBe("2026-01-10T00:00:00.000Z");
    expect(result.timeline.events.length).toBeGreaterThan(0);
    expect(result.timeline.events.some((event) => event.conversationId)).toBe(
      true,
    );
    expect(result.intelligence.followUpHints.length).toBeGreaterThan(0);
    expect(result.safety).toEqual({
      readOnly: true,
      mutationAllowed: false,
      requiresHumanApprovalForMutation: true,
      policyVersion: "customer-timeline-intelligence-read-model-v1",
    });
  });
});
