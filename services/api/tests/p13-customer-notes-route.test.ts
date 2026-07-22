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

const agentHeaders = {
  "x-mock-user-id": "usr_demo_agent",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "agent",
};

const viewerHeaders = {
  ...agentHeaders,
  "x-mock-user-id": "usr_demo_viewer",
  "x-mock-role": "viewer",
};

describe("P13 customer notes routes", () => {
  it("requires auth for customer notes", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/notes",
    });

    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("lists safe workspace-scoped customer notes for viewers", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/notes",
      headers: viewerHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().data[0]).toMatchObject({
      id: "note_demo_budi_intro",
      customer_id: "cust_demo_budi",
      author_user_id: "usr_demo_agent",
    });
    expect(JSON.stringify(response.json())).not.toContain("access_token");
    expect(JSON.stringify(response.json())).not.toContain("raw_provider");
  });

  it("creates a customer note for authenticated operators", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/notes",
      headers: agentHeaders,
      payload: {
        body: "Call back after product catalog refresh.",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      note: {
        customer_id: "cust_demo_budi",
        author_user_id: "usr_demo_agent",
        body: "Call back after product catalog refresh.",
      },
      feedback: {
        status: "created",
      },
    });
  });

  it("blocks viewer note creation server-side", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/notes",
      headers: viewerHeaders,
      payload: {
        body: "Viewer should not write notes.",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
  });
});
