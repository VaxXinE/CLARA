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

describe("P13 follow-up task routes", () => {
  it("requires auth for list/create/update", async () => {
    const app = await createServer({ env: testEnv });

    const list = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/tasks",
    });
    const create = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/tasks",
      payload: { title: "Call customer" },
    });
    const update = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/tasks/task_demo",
      payload: { status: "completed" },
    });

    await app.close();

    expect(list.statusCode).toBe(401);
    expect(create.statusCode).toBe(401);
    expect(update.statusCode).toBe(401);
  });

  it("creates, lists, and updates a task through safe DTOs", async () => {
    const app = await createServer({ env: testEnv });

    const create = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/tasks",
      headers: headers("agent"),
      payload: {
        title: "Call customer",
        body: "Confirm safe next step",
        dueAt: "2030-01-02",
        assigneeUserId: "usr_demo_agent",
      },
    });
    const taskId = create.json().task.id as string;
    const list = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/tasks",
      headers: headers("agent"),
    });
    const update = await app.inject({
      method: "PATCH",
      url: `/api/v1/customers/cust_demo_budi/tasks/${taskId}`,
      headers: headers("agent"),
      payload: { status: "completed" },
    });

    await app.close();

    expect(create.statusCode).toBe(201);
    expect(list.statusCode).toBe(200);
    expect(update.statusCode).toBe(200);
    expect(update.json().task.status).toBe("completed");
    expect(JSON.stringify(update.json())).not.toContain("access_token");
    expect(JSON.stringify(update.json())).not.toContain("raw_provider");
  });

  it("blocks viewer create and rejects unknown fields", async () => {
    const app = await createServer({ env: testEnv });

    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/tasks",
      headers: headers("viewer"),
      payload: { title: "Call customer" },
    });
    const unknown = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/tasks",
      headers: headers("agent"),
      payload: { title: "Call customer", workspace_id: "wks_other" },
    });

    await app.close();

    expect(viewer.statusCode).toBe(403);
    expect(unknown.statusCode).toBe(400);
  });
});
