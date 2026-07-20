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

const ownerHeaders = {
  "x-mock-user-id": "usr_demo_owner",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "owner",
};

describe("P10 client workspace spoofing regression", () => {
  it("rejects explicit workspace and organization query authority attempts", async () => {
    const app = await createServer({ env: testEnv });

    const tenantIsolation = await app.inject({
      method: "GET",
      url: "/api/v1/enterprise/tenant-isolation/readiness?workspaceId=wks_other",
      headers: ownerHeaders,
    });
    const permissionAudit = await app.inject({
      method: "GET",
      url: "/api/v1/enterprise/permission-audit/readiness?organization_id=org_other",
      headers: ownerHeaders,
    });

    await app.close();

    expect(tenantIsolation.statusCode).toBe(400);
    expect(permissionAudit.statusCode).toBe(400);
    expect(tenantIsolation.json().error.code).toBe("VALIDATION_ERROR");
    expect(permissionAudit.json().error.code).toBe("VALIDATION_ERROR");
  });
});
