import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureUserRoleManagementRepository } from "../src/auth/user-role-management-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { FixtureCustomerFollowUpTaskRepository } from "../src/customers/customer-follow-up-task-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P13 follow-up task activity timeline", () => {
  it("includes safe follow-up task events without raw payloads", async () => {
    const store = createFixtureAppStore();
    const service = new CustomerQueryService(
      new FixtureCustomerRepository(store),
      undefined,
      undefined,
      new FixtureUserRoleManagementRepository(),
      new FixtureCustomerFollowUpTaskRepository(store),
    );

    await service.createCustomerFollowUpTask({
      auth,
      customerId: "cust_demo_budi",
      correlationId: "corr_task_timeline",
      payload: { title: "Review renewal", body: "Internal safe note" },
    });

    const timeline = await service.listCustomerActivityTimeline({
      auth,
      customerId: "cust_demo_budi",
    });
    const json = JSON.stringify(timeline);

    expect(json).toContain("customer.follow_up_task.created");
    expect(json).toContain("Review renewal");
    expect(json).not.toContain("access_token");
    expect(json).not.toContain("refresh_token");
    expect(json).not.toContain("raw_provider");
  });
});
