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

function service() {
  const store = createFixtureAppStore();
  return new CustomerQueryService(
    new FixtureCustomerRepository(store),
    undefined,
    undefined,
    new FixtureUserRoleManagementRepository(),
    new FixtureCustomerFollowUpTaskRepository(store),
  );
}

describe("P13 follow-up task assignee boundary", () => {
  it("accepts active workspace assignee and rejects cross-workspace assignee", async () => {
    const accepted = await service().createCustomerFollowUpTask({
      auth,
      customerId: "cust_demo_budi",
      correlationId: "corr_good_assignee",
      payload: { title: "Call", assigneeUserId: "usr_demo_agent" },
    });

    expect(accepted.task.assignee_user_id).toBe("usr_demo_agent");

    await expect(
      service().createCustomerFollowUpTask({
        auth,
        customerId: "cust_demo_budi",
        correlationId: "corr_cross_assignee",
        payload: { title: "Call", assigneeUserId: "usr_demo_other_agent" },
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
