import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

function auth(role: "owner" | "agent" | "viewer" = "agent") {
  return buildAuthContext({
    userId:
      role === "owner"
        ? "usr_demo_owner"
        : role === "viewer"
          ? "usr_demo_viewer"
          : "usr_demo_agent",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role,
  });
}

describe("P13 CustomerQueryService CRUD activation", () => {
  it("normalizes safe customer create/update input", async () => {
    const service = new CustomerQueryService(
      new FixtureCustomerRepository(createFixtureAppStore()),
    );

    const created = await service.createCustomer({
      auth: auth("agent"),
      correlationId: "corr_p13_customer_create",
      payload: {
        displayName: "  Clara Buyer  ",
        contactIdentifier: " buyer@example.test ",
        notesSummary: "  Safe summary only. ",
      },
    });

    expect(created.customer).toMatchObject({
      display_name: "Clara Buyer",
      contact_identifier: "buyer@example.test",
      source: "demo",
      status: "new",
      notes_summary: "Safe summary only.",
    });

    const updated = await service.updateCustomer({
      auth: auth("owner"),
      customerId: created.customer.id,
      correlationId: "corr_p13_customer_update",
      payload: {
        displayName: "  Clara Account  ",
        status: "active",
      },
    });

    expect(updated.customer).toMatchObject({
      id: created.customer.id,
      display_name: "Clara Account",
      status: "active",
    });
  });

  it("denies viewer create/update through backend permissions", async () => {
    const service = new CustomerQueryService(
      new FixtureCustomerRepository(createFixtureAppStore()),
    );

    await expect(
      service.createCustomer({
        auth: auth("viewer"),
        correlationId: "corr_p13_viewer_create",
        payload: {
          displayName: "Blocked Viewer",
        },
      }),
    ).rejects.toMatchObject({ statusCode: 403 });

    await expect(
      service.updateCustomer({
        auth: auth("viewer"),
        customerId: "cust_demo_budi",
        correlationId: "corr_p13_viewer_update",
        payload: {
          displayName: "Blocked Viewer",
        },
      }),
    ).rejects.toMatchObject({ statusCode: 403 });
  });
});
