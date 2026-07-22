import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P13 customer lifecycle status service", () => {
  it("accepts allowed lifecycle status values", async () => {
    const service = new CustomerQueryService(
      new FixtureCustomerRepository(createFixtureAppStore()),
    );

    const result = await service.updateCustomerLifecycleStatus({
      auth,
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_status_allowed",
      payload: { status: "resolved" },
    });

    expect(result.customer.status).toBe("resolved");
  });

  it("rejects invalid lifecycle status values", async () => {
    const service = new CustomerQueryService(
      new FixtureCustomerRepository(createFixtureAppStore()),
    );

    await expect(
      service.updateCustomerLifecycleStatus({
        auth,
        customerId: "cust_demo_budi",
        correlationId: "corr_p13_status_invalid",
        payload: { status: "billing_ready" },
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
