import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

const env = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  LOG_LEVEL: "silent",
  AUTH_MODE: "mock",
  MOCK_AUTH_ENABLED: "true",
  CORS_ORIGIN: "https://dashboard.example.test",
});

describe("P19 internal deployment health ready smoke", () => {
  it("keeps health and ready responses safe", async () => {
    const app = await createServer({ env });

    const health = await app.inject({ method: "GET", url: "/health" });
    const ready = await app.inject({ method: "GET", url: "/ready" });

    await app.close();

    expect(health.statusCode).toBe(200);
    expect(ready.statusCode).toBe(200);
    expect(health.body + ready.body).not.toContain("access_token");
    expect(health.body + ready.body).not.toContain("Authorization");
  });
});
