import { describe, expect, it } from "vitest";
import { runApiRuntimeConfigDoctor } from "../src/config/runtime-config-doctor";

describe("P19 internal deployment no secret exposure", () => {
  it("redacts config doctor output", () => {
    const result = runApiRuntimeConfigDoctor({
      NODE_ENV: "development",
      INTERNAL_CRM_RUNTIME_ENABLED: "true",
      AUTH_MODE: "provider",
      AUTH_PROVIDER: "supabase",
      MOCK_AUTH_ENABLED: "false",
      SUPABASE_AUTH_JWKS_URL: "https://example.supabase.test/auth/v1/jwks",
      SUPABASE_AUTH_ISSUER: "https://example.supabase.test/auth/v1",
      DATABASE_URL: "postgresql://user:hidden@db:5432/clara",
      CORS_ORIGIN: "https://dashboard.example.test",
    });
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("hidden");
    expect(serialized).not.toContain("postgresql://");
    expect(serialized).not.toContain("example.supabase.test");
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
  });
});
