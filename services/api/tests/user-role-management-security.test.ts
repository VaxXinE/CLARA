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

function expectNoSensitiveMaterial(value: unknown): void {
  const serialized = JSON.stringify(value);

  expect(serialized).not.toContain("access_token");
  expect(serialized).not.toContain("refresh_token");
  expect(serialized).not.toContain("Authorization");
  expect(serialized).not.toContain("cookie");
  expect(serialized).not.toContain(["client", "secret"].join("_"));
  expect(serialized).not.toContain("provider_subject");
  expect(serialized).not.toContain("raw provider");
  expect(serialized).not.toContain("service role");
}

describe("P5 user role management security", () => {
  it("has no public self-escalation path through query/body role spoofing", async () => {
    const app = await createServer({ env: testEnv });

    const querySpoof = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/roles/readiness?role=owner&organization_id=org_demo&workspace_id=wks_demo_sales",
      headers: authHeaders("agent"),
    });
    const bodySpoof = await app.inject({
      method: "POST",
      url: "/api/v1/workspace/members",
      headers: authHeaders("agent"),
      payload: {
        role: "owner",
        user_id: "usr_demo_agent",
        organization_id: "org_demo",
        workspace_id: "wks_demo_sales",
      },
    });

    await app.close();

    expect(querySpoof.statusCode).toBe(403);
    expect(bodySpoof.statusCode).toBe(404);
    expectNoSensitiveMaterial(querySpoof.json());
    expectNoSensitiveMaterial(bodySpoof.json());
  });

  it("ignores client-supplied organization and workspace as authority", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/members?organization_id=org_demo_other&workspace_id=wks_demo_other",
      headers: {
        ...authHeaders("owner"),
        "x-client-requested-role": "viewer",
      },
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
    expectNoSensitiveMaterial(response.json());
  });

  it("blocks agent and viewer from admin-only member list and readiness", async () => {
    const app = await createServer({ env: testEnv });

    const responses = await Promise.all([
      app.inject({
        method: "GET",
        url: "/api/v1/workspace/members",
        headers: authHeaders("agent"),
      }),
      app.inject({
        method: "GET",
        url: "/api/v1/workspace/members",
        headers: authHeaders("viewer"),
      }),
      app.inject({
        method: "GET",
        url: "/api/v1/workspace/roles/readiness",
        headers: authHeaders("agent"),
      }),
      app.inject({
        method: "GET",
        url: "/api/v1/workspace/roles/readiness",
        headers: authHeaders("viewer"),
      }),
    ]);

    await app.close();

    for (const response of responses) {
      expect(response.statusCode).toBe(403);
      expectNoSensitiveMaterial(response.json());
    }
  });

  it("returns sanitized owner member DTOs only", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/members",
      headers: authHeaders("owner"),
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(Object.keys(response.json().data.members[0]).sort()).toEqual([
      "created_at",
      "display_name",
      "email",
      "role",
      "status",
      "updated_at",
      "user_id",
    ]);
    expect(response.json().permissions).toEqual({
      can_read_members: true,
      can_invite_users: false,
      can_update_roles: false,
      can_delete_users: false,
    });
    expectNoSensitiveMaterial(response.json());
  });

  it("does not expose invite, create, update, or delete endpoints in this PR", async () => {
    const app = await createServer({ env: testEnv });

    const requests = await Promise.all(
      (
        [
          { method: "POST", url: "/api/v1/workspace/members" },
          { method: "PUT", url: "/api/v1/workspace/members/usr_demo_viewer" },
          { method: "PATCH", url: "/api/v1/workspace/members/usr_demo_viewer" },
          {
            method: "DELETE",
            url: "/api/v1/workspace/members/usr_demo_viewer",
          },
          { method: "POST", url: "/api/v1/workspace/roles/readiness" },
        ] as const
      ).map((request) =>
        app.inject({
          ...request,
          headers: authHeaders("owner"),
          payload: {
            role: "owner",
            user_id: "usr_demo_viewer",
            organization_id: "org_demo",
            workspace_id: "wks_demo_sales",
          },
        }),
      ),
    );

    await app.close();

    for (const response of requests) {
      expect(response.statusCode).toBe(404);
      expectNoSensitiveMaterial(response.json());
    }
  });
});
