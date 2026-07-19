import { readFileSync } from "node:fs";
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

describe("P9 final analytics no export or drilldown regression", () => {
  it("returns safety flags that disable report export and customer-level drilldown", async () => {
    const app = await createServer({ env: testEnv });
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/kpi-dashboard",
      headers: ownerHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().safety).toMatchObject({
      exportEnabled: false,
      drilldownEnabled: false,
      mutationAllowed: false,
    });
  });

  it("does not add export or customer drilldown runtime helpers", () => {
    const source = [
      "../src/analytics/analytics-reporting-route-support.ts",
      "../src/analytics/kpi-dashboard-card-service.ts",
      "../src/http/routes/analytics-kpi-dashboard.ts",
    ]
      .map((path) => readFileSync(new URL(path, import.meta.url), "utf8"))
      .join("\n");

    for (const pattern of [
      "exportReport",
      "downloadReport",
      "customerDrilldown",
      "customerLevelDrilldown: true",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
