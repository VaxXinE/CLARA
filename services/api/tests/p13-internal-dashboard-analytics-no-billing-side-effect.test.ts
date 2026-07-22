import { describe, expect, it } from "vitest";
import { InternalCrmDashboardAnalyticsService } from "../src/analytics/internal-crm-dashboard-analytics-service";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { FixtureCustomerFollowUpTaskRepository } from "../src/customers/customer-follow-up-task-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

describe("P13 internal dashboard analytics no billing side effect", () => {
  it("keeps billing/payment deferred in the safe response", async () => {
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
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
    });

    expect(response.workflow.billingPaymentDeferred).toBe(true);
    expect(response.safety.billingPaymentIncluded).toBe(false);
  });
});
