import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureUserRoleManagementRepository } from "../src/auth/user-role-management-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { FixtureCustomerFollowUpTaskRepository } from "../src/customers/customer-follow-up-task-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const otherWorkspaceAuth = buildAuthContext({
  userId: "usr_demo_other_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_support",
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

describe("P13 follow-up task workspace boundary", () => {
  it("rejects cross-workspace customer task creation", async () => {
    await expect(
      service().createCustomerFollowUpTask({
        auth: otherWorkspaceAuth,
        customerId: "cust_demo_budi",
        correlationId: "corr_p13_task_cross_workspace",
        payload: { title: "Cross workspace task" },
      }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
