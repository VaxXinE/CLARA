import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createLoggerOptions } from "../src/logging/logger";

describe("auth production guardrails", () => {
  it("blocks production startup when mock auth is explicitly enabled", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "production",
        APP_NAME: "clara-api",
        HOST: "127.0.0.1",
        PORT: "3000",
        LOG_LEVEL: "info",
        AUTH_MODE: "provider",
        AUTH_PROVIDER: "supabase",
        MOCK_AUTH_ENABLED: "true",
        SUPABASE_AUTH_JWKS_URL: "https://example.supabase.test/auth/v1/jwks",
        SUPABASE_AUTH_ISSUER: "https://example.supabase.test/auth/v1",
        CORS_ORIGIN: "",
      }),
    ).toThrow("mock auth must be disabled in production");
  });

  it("keeps local demo defaults safe and usable in mock mode", () => {
    const env = loadEnv({
      NODE_ENV: "development",
      APP_NAME: "clara-api",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "info",
      AUTH_MODE: "mock",
      MOCK_AUTH_ENABLED: "true",
      CORS_ORIGIN: "",
    });

    expect(env.AUTH_MODE).toBe("mock");
    expect(env.MOCK_AUTH_ENABLED).toBe(true);
    expect(env.AUTH_PROVIDER).toBeUndefined();
  });

  it("redacts authorization and token-like fields from logs", () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      CORS_ORIGIN: "",
    });

    const loggerOptions = createLoggerOptions(env);
    const redactPaths = loggerOptions.redact.paths;

    expect(redactPaths).toContain("req.headers.authorization");
    expect(redactPaths).toContain("*.authorization");
    expect(redactPaths).toContain("*.token");
    expect(redactPaths).toContain("*.access_token");
    expect(redactPaths).toContain("*.refresh_token");
  });
});
