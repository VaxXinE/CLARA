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

describe("P14 internal viewer read-only regression", () => {
  it("blocks viewer from role management and ignores client workspace spoofing", async () => {
    const app = await createServer({ env: testEnv });

    const readiness = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/roles/readiness?workspace_id=wks_other&role=owner",
      headers: viewerHeaders,
    });
    const mutation = await app.inject({
      method: "POST",
      url: "/api/v1/workspace/members",
      headers: viewerHeaders,
      payload: {
        workspace_id: "wks_other",
        role: "owner",
      },
    });

    await app.close();

    expect(readiness.statusCode).toBe(403);
    expect(mutation.statusCode).toBe(404);
    expect(JSON.stringify(readiness.json())).not.toContain("access_token");
    expect(JSON.stringify(mutation.json())).not.toContain(
      "raw_provider_payload",
    );
  });
});
