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

function authHeaders(role: "owner" | "agent" | "viewer") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

function expectSafe(value: unknown): void {
  const serialized = JSON.stringify(value);

  expect(serialized).not.toContain("access_token");
  expect(serialized).not.toContain("refresh_token");
  expect(serialized).not.toContain("Authorization");
  expect(serialized).not.toContain(["client", "secret"].join("_"));
  expect(serialized).not.toContain("raw provider");
}

describe("workspace user role management routes", () => {
  it("requires authentication", async () => {
    const app = await createServer({ env: testEnv });

    const members = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/members",
    });
    const readiness = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/roles/readiness",
    });

    await app.close();

    expect(members.statusCode).toBe(401);
    expect(readiness.statusCode).toBe(401);
    expectSafe(members.json());
    expectSafe(readiness.json());
  });

  it("allows owner to read safe members and readiness", async () => {
    const app = await createServer({ env: testEnv });

    const members = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/members",
      headers: authHeaders("owner"),
    });
    const readiness = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/roles/readiness",
      headers: authHeaders("owner"),
    });

    await app.close();

    expect(members.statusCode).toBe(200);
    expect(members.json().data.members).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: "usr_demo_owner",
          display_name: "Owner Demo",
          email: "owner@example.test",
          role: "owner",
          status: "active",
        }),
      ]),
    );
    expect(members.json().permissions).toMatchObject({
      can_invite_users: false,
      can_update_roles: false,
      can_delete_users: false,
    });
    expect(readiness.statusCode).toBe(200);
    expect(readiness.json()).toMatchObject({
      data: {
        status: "readiness_only",
        current_user: {
          id: "usr_demo_owner",
          role: "owner",
        },
      },
    });
    expectSafe(members.json());
    expectSafe(readiness.json());
  });

  it("blocks agent and viewer from role management readiness", async () => {
    const app = await createServer({ env: testEnv });

    const agent = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/members",
      headers: authHeaders("agent"),
    });
    const viewer = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/roles/readiness",
      headers: authHeaders("viewer"),
    });

    await app.close();

    expect(agent.statusCode).toBe(403);
    expect(viewer.statusCode).toBe(403);
    expectSafe(agent.json());
    expectSafe(viewer.json());
  });

  it("derives organization and workspace from AuthContext only", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/members?organization_id=org_demo_other&workspace_id=wks_demo_other&role=viewer",
      headers: authHeaders("owner"),
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().data.members).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: "usr_demo_owner",
          role: "owner",
        }),
      ]),
    );
    expect(response.json().data.members).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: "usr_demo_other_agent",
        }),
      ]),
    );
    expectSafe(response.json());
  });

  it("does not expose membership mutation endpoints", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/workspace/members",
      headers: authHeaders("owner"),
      payload: {
        user_id: "usr_demo_viewer",
        role: "owner",
        organization_id: "org_demo",
        workspace_id: "wks_demo_sales",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expectSafe(response.json());
  });
});
