import { describe, expect, it } from "vitest";
import { runApiRuntimeConfigDoctor } from "../src/config/runtime-config-doctor";

function productionEnv(overrides: Record<string, string> = {}) {
  return {
    NODE_ENV: "production",
    AUTH_MODE: "provider",
    AUTH_PROVIDER: "supabase",
    MOCK_AUTH_ENABLED: "false",
    SUPABASE_AUTH_JWKS_URL: "https://example.supabase.test/auth/v1/jwks",
    SUPABASE_AUTH_ISSUER: "https://example.supabase.test/auth/v1",
    DATABASE_URL: "postgresql://user:hidden-value@db:5432/clara",
    CORS_ORIGIN: "https://dashboard.example.test",
    LOG_LEVEL: "info",
    RATE_LIMIT_ENABLED: "true",
    ...overrides,
  };
}

describe("API runtime config doctor", () => {
  it("fails production mock auth mode", () => {
    const result = runApiRuntimeConfigDoctor(
      productionEnv({
        AUTH_MODE: "mock",
        MOCK_AUTH_ENABLED: "true",
      }),
    );

    expect(result.status).toBe("fail");
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "api.auth_mode",
          status: "fail",
        }),
        expect.objectContaining({
          name: "api.mock_auth",
          status: "fail",
        }),
      ]),
    );
  });

  it("fails provider mode when provider or Supabase config is missing", () => {
    const missingProvider = runApiRuntimeConfigDoctor(
      productionEnv({
        AUTH_PROVIDER: "",
      }),
    );
    const missingSupabaseConfig = runApiRuntimeConfigDoctor(
      productionEnv({
        SUPABASE_AUTH_JWKS_URL: "",
      }),
    );

    expect(missingProvider.status).toBe("fail");
    expect(missingSupabaseConfig.status).toBe("fail");
    expect(missingProvider.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "api.auth_provider",
          status: "fail",
        }),
      ]),
    );
    expect(missingSupabaseConfig.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "api.supabase_provider",
          status: "fail",
        }),
      ]),
    );
  });

  it("fails dangerous production runtime settings", () => {
    const result = runApiRuntimeConfigDoctor(
      productionEnv({
        DATABASE_URL: "",
        CORS_ORIGIN: "*",
        LOG_LEVEL: "debug",
      }),
    );

    expect(result.status).toBe("fail");
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "api.database_url", status: "fail" }),
        expect.objectContaining({ name: "api.cors_origin", status: "fail" }),
        expect.objectContaining({ name: "api.log_level", status: "fail" }),
      ]),
    );
  });

  it("allows local mock mode with safe non-production output", () => {
    const result = runApiRuntimeConfigDoctor({
      NODE_ENV: "development",
      AUTH_MODE: "mock",
      MOCK_AUTH_ENABLED: "true",
      LOG_LEVEL: "debug",
    });

    expect(result.status).toBe("pass");
  });

  it("does not echo secret-looking config values", () => {
    const result = runApiRuntimeConfigDoctor(productionEnv());
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("hidden-value");
    expect(serialized).not.toContain("postgresql://");
    expect(serialized).not.toContain("example.supabase.test");
  });
});
