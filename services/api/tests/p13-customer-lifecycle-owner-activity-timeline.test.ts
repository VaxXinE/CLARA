import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureUserRoleManagementRepository } from "../src/auth/user-role-management-repository";
import { FixtureCustomerNoteRepository } from "../src/customers/customer-note-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_owner",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "owner",
});

describe("P13 customer lifecycle owner activity timeline", () => {
  it("includes safe lifecycle and owner timeline events", async () => {
    const store = createFixtureAppStore();
    const service = new CustomerQueryService(
      new FixtureCustomerRepository(store),
      undefined,
      new FixtureCustomerNoteRepository(store),
      new FixtureUserRoleManagementRepository(),
    );

    await service.updateCustomerLifecycleStatus({
      auth,
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_timeline_status",
      payload: { status: "at_risk" },
    });
    await service.assignCustomerOwner({
      auth,
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_timeline_owner",
      payload: { ownerUserId: "usr_demo_agent" },
    });

    const timeline = await service.listCustomerActivityTimeline({
      auth,
      customerId: "cust_demo_budi",
    });

    expect(timeline.data.map((event) => event.type)).toEqual(
      expect.arrayContaining([
        "customer.status.updated",
        "customer.owner.assigned",
      ]),
    );
    expect(JSON.stringify(timeline)).not.toContain("raw_provider");
    expect(JSON.stringify(timeline)).not.toContain("access_token");
  });
});
