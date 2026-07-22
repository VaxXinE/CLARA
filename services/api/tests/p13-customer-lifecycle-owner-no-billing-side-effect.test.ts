import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureUserRoleManagementRepository } from "../src/auth/user-role-management-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_owner",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "owner",
});

describe("P13 customer lifecycle owner no billing side effect", () => {
  it("returns only CRM mutation feedback without billing/payment fields", async () => {
    const service = new CustomerQueryService(
      new FixtureCustomerRepository(createFixtureAppStore()),
      undefined,
      undefined,
      new FixtureUserRoleManagementRepository(),
    );

    const statusResult = await service.updateCustomerLifecycleStatus({
      auth,
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_no_billing_status",
      payload: { status: "resolved" },
    });
    const ownerResult = await service.assignCustomerOwner({
      auth,
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_no_billing_owner",
      payload: { ownerUserId: "usr_demo_agent" },
    });
    const serialized = JSON.stringify([statusResult, ownerResult]);

    expect(serialized).not.toContain("checkout");
    expect(serialized).not.toContain("invoice");
    expect(serialized).not.toContain("subscription");
    expect(serialized).not.toContain("payment");
    expect(serialized).not.toContain("quota");
  });
});
