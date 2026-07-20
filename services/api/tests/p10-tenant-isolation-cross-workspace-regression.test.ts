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

describe("P10 tenant isolation cross-workspace regression", () => {
  it("returns the backend workspace and never a query workspace", async () => {
    const app = await createServer({ env: testEnv });
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/enterprise/tenant-isolation/readiness?workspace=wks_other",
      headers: {
        "x-mock-user-id": "usr_demo_agent",
        "x-mock-organization-id": "org_demo",
        "x-mock-workspace-id": "wks_demo_sales",
        "x-mock-role": "agent",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().workspaceId).toBe("wks_demo_sales");
    expect(JSON.stringify(response.json())).not.toContain("wks_other");
  });
});
