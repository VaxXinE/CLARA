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

describe("P13 customer lifecycle and owner assignment routes", () => {
  it("requires auth for lifecycle status update", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/lifecycle-status",
      payload: { status: "follow_up" },
    });

    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("updates lifecycle status through backend AuthContext scope only", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/lifecycle-status",
      headers: headers("agent"),
      payload: {
        status: "at_risk",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      customer: {
        id: "cust_demo_budi",
        status: "at_risk",
      },
      feedback: {
        status: "status_updated",
      },
    });
    expect(JSON.stringify(response.json())).not.toContain("access_token");
    expect(JSON.stringify(response.json())).not.toContain("raw_provider");
  });

  it("rejects unknown lifecycle request fields", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/lifecycle-status",
      headers: headers("agent"),
      payload: {
        status: "resolved",
        organization_id: "org_other",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
  });

  it("assigns only active workspace members as customer owner", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/owner-assignment",
      headers: headers("owner"),
      payload: {
        ownerUserId: "usr_demo_agent",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      customer: {
        id: "cust_demo_budi",
        owner_user_id: "usr_demo_agent",
      },
      feedback: {
        status: "owner_assigned",
      },
    });
    expect(JSON.stringify(response.json())).not.toContain("refresh_token");
    expect(JSON.stringify(response.json())).not.toContain("Authorization");
  });

  it("rejects inactive or cross-workspace owner assignment", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/owner-assignment",
      headers: headers("owner"),
      payload: {
        ownerUserId: "usr_demo_other_agent",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
  });

  it("blocks viewer lifecycle and owner mutations", async () => {
    const app = await createServer({ env: testEnv });

    const lifecycle = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/lifecycle-status",
      headers: headers("viewer"),
      payload: { status: "resolved" },
    });
    const owner = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/owner-assignment",
      headers: headers("viewer"),
      payload: { ownerUserId: "usr_demo_agent" },
    });

    await app.close();

    expect(lifecycle.statusCode).toBe(403);
    expect(owner.statusCode).toBe(403);
  });
});
