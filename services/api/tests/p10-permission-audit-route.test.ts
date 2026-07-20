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

describe("GET /api/v1/enterprise/permission-audit/readiness", () => {
  it("requires auth and returns read-only role boundary summaries", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "GET",
      url: "/api/v1/enterprise/permission-audit/readiness",
    });
    const authenticated = await app.inject({
      method: "GET",
      url: "/api/v1/enterprise/permission-audit/readiness",
      headers: viewerHeaders,
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(authenticated.statusCode).toBe(200);
    expect(authenticated.json()).toMatchObject({
      workspaceId: "wks_demo_sales",
      phase: "p10",
      roleBoundaries: expect.arrayContaining([
        expect.objectContaining({
          role: "viewer",
          auditRequiredForDeniedAccess: true,
          mutationAllowed: false,
        }),
      ]),
      safety: {
        readOnly: true,
        permissionMutationAllowed: false,
        roleMutationAllowed: false,
      },
    });
  });
});
