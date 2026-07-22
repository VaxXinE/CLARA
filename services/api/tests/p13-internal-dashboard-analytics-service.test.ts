import { describe, expect, it } from "vitest";
import { InternalCrmDashboardAnalyticsService } from "../src/analytics/internal-crm-dashboard-analytics-service";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { FixtureCustomerFollowUpTaskRepository } from "../src/customers/customer-follow-up-task-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

describe("InternalCrmDashboardAnalyticsService", () => {
  it("builds safe aggregate CRM dashboard metrics", async () => {
    const store = createFixtureAppStore();
    const service = new InternalCrmDashboardAnalyticsService(
      new FixtureCustomerRepository(store),
      new FixtureConversationRepository(store),
      new FixtureCustomerFollowUpTaskRepository(store),
      new FixtureAuditLogRepository(store),
      () => new Date("2026-07-22T00:00:00.000Z"),
    );

    const response = await service.getDashboard({
      auth: buildAuthContext({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      query: { timeWindow: "7d" },
    });

    expect(response.workspaceId).toBe("wks_demo_sales");
    expect(response.timeWindow).toBe("7d");
    expect(response.customers.total).toBeGreaterThan(0);
    expect(response.lifecycle.summary.length).toBeGreaterThan(0);
    expect(response.conversations.total).toBeGreaterThan(0);
    expect(response.workflow.mutationAllowed).toBe(false);
    expect(response.safety).toMatchObject({
      aggregated: true,
      workspaceScoped: true,
      readOnly: true,
      rawPayloadIncluded: false,
      tokensIncluded: false,
      heavyAnalyticsJobCreated: false,
      exportCreated: false,
    });
  });
});
