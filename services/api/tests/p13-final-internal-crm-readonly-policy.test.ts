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

const viewerHeaders = {
  "x-mock-user-id": "usr_demo_viewer",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "viewer",
};

describe("P13 final internal CRM readonly policy", () => {
  it("lets viewer read CRM data but blocks CRM mutations", async () => {
    const app = await createServer({ env: testEnv });

    const list = await app.inject({
      method: "GET",
      url: "/api/v1/customers",
      headers: viewerHeaders,
    });
    const create = await app.inject({
      method: "POST",
      url: "/api/v1/customers",
      headers: viewerHeaders,
      payload: { displayName: "Viewer Escalation" },
    });
    const note = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/notes",
      headers: viewerHeaders,
      payload: { body: "viewer should not write" },
    });
    const lifecycle = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/lifecycle-status",
      headers: viewerHeaders,
      payload: { status: "resolved" },
    });
    const task = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/tasks",
      headers: viewerHeaders,
      payload: { title: "viewer should not create task" },
    });
    const link = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers: viewerHeaders,
      payload: { customerId: "cust_demo_sari" },
    });

    await app.close();

    expect(list.statusCode).toBe(200);
    expect(create.statusCode).toBe(403);
    expect(note.statusCode).toBe(403);
    expect(lifecycle.statusCode).toBe(403);
    expect(task.statusCode).toBe(403);
    expect(link.statusCode).toBe(403);
  });
});
