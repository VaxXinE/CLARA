import { describe, expect, it } from "vitest";
import { runApiRuntimeConfigDoctor } from "../src/config/runtime-config-doctor";

function config(corsOrigin: string) {
  return {
    NODE_ENV: "development",
    INTERNAL_CRM_RUNTIME_ENABLED: "true",
    AUTH_MODE: "provider",
    AUTH_PROVIDER: "supabase",
    MOCK_AUTH_ENABLED: "false",
    SUPABASE_AUTH_JWKS_URL: "https://example.supabase.test/auth/v1/jwks",
    SUPABASE_AUTH_ISSUER: "https://example.supabase.test/auth/v1",
    DATABASE_URL: "postgresql://user:hidden@db:5432/clara",
    CORS_ORIGIN: corsOrigin,
  };
}

describe("P19 internal deployment CORS origin policy", () => {
  it("rejects wildcard or empty CORS for internal deployment", () => {
    expect(runApiRuntimeConfigDoctor(config("*")).status).toBe("fail");
    expect(runApiRuntimeConfigDoctor(config("")).status).toBe("fail");
  });

  it("accepts explicit internal dashboard origin", () => {
    expect(
      runApiRuntimeConfigDoctor(config("https://dashboard.example.test"))
        .status,
    ).toBe("pass");
  });
});
