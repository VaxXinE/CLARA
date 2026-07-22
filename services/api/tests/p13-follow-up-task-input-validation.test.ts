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

describe("P13 follow-up task input validation", () => {
  it("rejects empty title, too-long body, unsafe due date, and invalid status", async () => {
    await expect(
      service().createCustomerFollowUpTask({
        auth,
        customerId: "cust_demo_budi",
        correlationId: "corr_empty_title",
        payload: { title: " " },
      }),
    ).rejects.toMatchObject({ statusCode: 400 });

    await expect(
      service().createCustomerFollowUpTask({
        auth,
        customerId: "cust_demo_budi",
        correlationId: "corr_long_body",
        payload: { title: "Call", body: "x".repeat(2001) },
      }),
    ).rejects.toMatchObject({ statusCode: 400 });

    await expect(
      service().createCustomerFollowUpTask({
        auth,
        customerId: "cust_demo_budi",
        correlationId: "corr_bad_due",
        payload: { title: "Call", dueAt: "1800-01-01" },
      }),
    ).rejects.toMatchObject({ statusCode: 400 });

    await expect(
      service().updateCustomerFollowUpTask({
        auth,
        customerId: "cust_demo_budi",
        taskId: "task_missing",
        correlationId: "corr_bad_status",
        payload: { status: "paid" as never },
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
