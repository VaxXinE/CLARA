import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { runApiRuntimeConfigDoctor } from "../src/config/runtime-config-doctor";

const internalEnv = {
  NODE_ENV: "development",
  AUTH_MODE: "provider",
  AUTH_PROVIDER: "supabase",
  MOCK_AUTH_ENABLED: "false",
  INTERNAL_CRM_RUNTIME_ENABLED: "true",
  SUPABASE_AUTH_JWKS_URL: "https://example.supabase.test/auth/v1/jwks",
  SUPABASE_AUTH_ISSUER: "https://example.supabase.test/auth/v1",
  DATABASE_URL: "postgresql://user:hidden@db:5432/clara",
  CORS_ORIGIN: "https://dashboard.example.test",
};

describe("P19 internal deployment config doctor", () => {
  it("requires provider auth and rejects mock auth as internal runtime", () => {
    const result = runApiRuntimeConfigDoctor({
      ...internalEnv,
      AUTH_MODE: "mock",
      MOCK_AUTH_ENABLED: "true",
    });

    expect(result.status).toBe("fail");
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "api.auth_mode", status: "fail" }),
        expect.objectContaining({ name: "api.mock_auth", status: "fail" }),
      ]),
    );
  });

  it("requires database and provider config for internal runtime", () => {
    const result = runApiRuntimeConfigDoctor({
      ...internalEnv,
      DATABASE_URL: "",
      SUPABASE_AUTH_ISSUER: "",
    });

    expect(result.status).toBe("fail");
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "api.database_url", status: "fail" }),
        expect.objectContaining({
          name: "api.supabase_provider",
          status: "fail",
        }),
      ]),
    );
  });

  it("keeps loadEnv fail-closed for unsafe internal runtime config", () => {
    expect(() =>
      loadEnv({
        ...internalEnv,
        CORS_ORIGIN: "*",
      }),
    ).toThrow("explicit non-wildcard CORS_ORIGIN");
  });
});
