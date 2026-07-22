import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function headers(role: "owner" | "agent" | "viewer" = "agent") {
  return {
    "x-mock-user-id":
      role === "owner"
        ? "usr_demo_owner"
        : role === "viewer"
          ? "usr_demo_viewer"
          : "usr_demo_agent",
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

describe("P13 customer CRUD activation routes", () => {
  it("requires auth for customer list", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers",
    });

    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("lists workspace-scoped customers with safe DTO fields", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers?search=budi",
      headers: headers("viewer"),
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toEqual([
      expect.objectContaining({
        id: "cust_demo_budi",
        display_name: "Budi Santoso",
        contact_identifier: "+620000000001",
      }),
    ]);
    expect(JSON.stringify(response.json())).not.toContain("workspaceId");
    expect(JSON.stringify(response.json())).not.toContain("organizationId");
    expect(JSON.stringify(response.json())).not.toContain("providerPayload");
  });

  it("creates and updates customer records through authenticated operators", async () => {
    const app = await createServer({ env: testEnv });

    const created = await app.inject({
      method: "POST",
      url: "/api/v1/customers",
      headers: headers("agent"),
      payload: {
        displayName: "Internal CRM Lead",
        contactIdentifier: "lead@example.test",
        status: "new",
        notesSummary: "Safe internal note preview.",
      },
    });

    expect(created.statusCode).toBe(201);

    const customerId = created.json().customer.id;
    const updated = await app.inject({
      method: "PATCH",
      url: `/api/v1/customers/${customerId}`,
      headers: headers("owner"),
      payload: {
        displayName: "Internal CRM Customer",
        status: "active",
      },
    });

    await app.close();

    expect(updated.statusCode).toBe(200);
    expect(updated.json()).toMatchObject({
      customer: {
        id: customerId,
        display_name: "Internal CRM Customer",
        status: "active",
      },
      feedback: {
        status: "updated",
      },
    });
  });

  it("blocks viewer mutation server-side", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/customers",
      headers: headers("viewer"),
      payload: {
        displayName: "Viewer Escalation Attempt",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
  });
});
