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

function service() {
  return new CustomerQueryService(
    new FixtureCustomerRepository(createFixtureAppStore()),
    undefined,
    undefined,
    new FixtureUserRoleManagementRepository(),
  );
}

describe("P13 customer owner assignment service", () => {
  it("assigns an active workspace member", async () => {
    const result = await service().assignCustomerOwner({
      auth,
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_assign_owner",
      payload: { ownerUserId: "usr_demo_agent" },
    });

    expect(result.customer.owner_user_id).toBe("usr_demo_agent");
  });

  it("rejects non-member owner ids", async () => {
    await expect(
      service().assignCustomerOwner({
        auth,
        customerId: "cust_demo_budi",
        correlationId: "corr_p13_assign_non_member",
        payload: { ownerUserId: "usr_demo_no_membership" },
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
