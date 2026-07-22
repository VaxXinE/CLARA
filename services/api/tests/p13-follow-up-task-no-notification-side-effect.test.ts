import { describe, expect, it, vi } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureUserRoleManagementRepository } from "../src/auth/user-role-management-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { FixtureCustomerFollowUpTaskRepository } from "../src/customers/customer-follow-up-task-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

describe("P13 follow-up task no notification side effect", () => {
  it("does not call fetch while creating a task", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const store = createFixtureAppStore();

    await new CustomerQueryService(
      new FixtureCustomerRepository(store),
      undefined,
      undefined,
      new FixtureUserRoleManagementRepository(),
      new FixtureCustomerFollowUpTaskRepository(store),
    ).createCustomerFollowUpTask({
      auth: buildAuthContext({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      customerId: "cust_demo_budi",
      correlationId: "corr_no_notification",
      payload: { title: "Call customer" },
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
