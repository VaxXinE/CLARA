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

describe("P13 customer CRUD workspace boundary", () => {
  it("does not list customers from another workspace", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers",
      headers: agentHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.json())).not.toContain(
      "cust_other_workspace",
    );
  });

  it("returns safe not found for cross-workspace update attempts", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_other_workspace",
      headers: agentHeaders,
      payload: {
        displayName: "Attempted Update",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: {
        code: "NOT_FOUND",
      },
    });
  });

  it("rejects client-supplied organization and workspace authority", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi",
      headers: agentHeaders,
      payload: {
        displayName: "Spoofed Workspace Update",
        organization_id: "org_demo_other",
        workspace_id: "wks_demo_other",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: "VALIDATION_ERROR",
      },
    });
  });
});
