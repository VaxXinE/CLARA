import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";

function createProductionEnv(overrides: Record<string, string> = {}) {
  return {
    NODE_ENV: "production",
    APP_NAME: "clara-api",
    HOST: "127.0.0.1",
    PORT: "3000",
    LOG_LEVEL: "info",
    AUTH_MODE: "provider",
    AUTH_PROVIDER: "supabase",
    MOCK_AUTH_ENABLED: "false",
    SUPABASE_AUTH_JWKS_URL: "https://example.supabase.test/auth/v1/jwks",
    SUPABASE_AUTH_ISSUER: "https://example.supabase.test/auth/v1",
    DATABASE_URL:
      "postgresql://clara_user:clara_password_dev_only@127.0.0.1:5432/clara_api_prod_like",
    CORS_ORIGIN: "https://dashboard.example.test",
    RATE_LIMIT_ENABLED: "true",
    REQUEST_BODY_LIMIT_BYTES: "1048576",
    ...overrides,
  };
}

describe("deployment configuration guardrails", () => {
  it("requires DATABASE_URL in production", () => {
    expect(() => loadEnv(createProductionEnv({ DATABASE_URL: "" }))).toThrow(
      "DATABASE_URL is required in production",
    );
  });

  it("requires an explicit CORS origin in production", () => {
    expect(() => loadEnv(createProductionEnv({ CORS_ORIGIN: "" }))).toThrow(
      "CORS_ORIGIN must be set to at least one explicit origin in production",
    );
  });

  it("rejects wildcard CORS in production", () => {
    expect(() => loadEnv(createProductionEnv({ CORS_ORIGIN: "*" }))).toThrow(
      "CORS_ORIGIN=* is not allowed in production",
    );
  });

  it("requires rate limiting to stay enabled in production", () => {
    expect(() =>
      loadEnv(createProductionEnv({ RATE_LIMIT_ENABLED: "false" })),
    ).toThrow("RATE_LIMIT_ENABLED must remain true in production");
  });

  it("rejects unsafe production log levels", () => {
    for (const logLevel of ["debug", "trace", "silent"]) {
      expect(() =>
        loadEnv(createProductionEnv({ LOG_LEVEL: logLevel })),
      ).toThrow(
        "LOG_LEVEL must be one of fatal, error, warn, or info in production",
      );
    }
  });

  it("accepts secure production deployment config", () => {
    const env = loadEnv(
      createProductionEnv({
        LOG_LEVEL: "warn",
        CORS_ORIGIN: "https://dashboard.example.test,https://ops.example.test",
      }),
    );

    expect(env.NODE_ENV).toBe("production");
    expect(env.AUTH_MODE).toBe("provider");
    expect(env.MOCK_AUTH_ENABLED).toBe(false);
    expect(env.RATE_LIMIT_ENABLED).toBe(true);
    expect(env.DATABASE_URL).toContain("postgresql://");
    expect(env.CORS_ORIGIN).toBe(
      "https://dashboard.example.test,https://ops.example.test",
    );
  });
});
