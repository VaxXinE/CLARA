import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureUserRoleManagementRepository } from "../src/auth/user-role-management-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { FixtureCustomerFollowUpTaskRepository } from "../src/customers/customer-follow-up-task-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

describe("P13 follow-up task no billing side effect", () => {
  it("creates an internal CRM task without billing/payment/subscription output", async () => {
    const store = createFixtureAppStore();
    const result = await new CustomerQueryService(
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
      correlationId: "corr_no_billing",
      payload: { title: "Call customer" },
    });
    const json = JSON.stringify(result).toLowerCase();

    expect(json).not.toContain("checkout");
    expect(json).not.toContain("invoice");
    expect(json).not.toContain("subscription");
    expect(json).not.toContain("payment");
  });
});
