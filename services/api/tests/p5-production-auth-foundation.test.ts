import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

function productionEnv(overrides: Record<string, string> = {}) {
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
    ...overrides,
  };
}

describe("P5 production auth foundation", () => {
  it("keeps production fail-closed for mock auth and unsafe deployment config", () => {
    expect(() => loadEnv(productionEnv({ AUTH_MODE: "mock" }))).toThrow(
      "AUTH_MODE=mock is not allowed in production",
    );
    expect(() => loadEnv(productionEnv({ MOCK_AUTH_ENABLED: "true" }))).toThrow(
      "mock auth must be disabled in production",
    );
    expect(() => loadEnv(productionEnv({ CORS_ORIGIN: "*" }))).toThrow(
      "CORS_ORIGIN=* is not allowed in production",
    );
    expect(() => loadEnv(productionEnv({ LOG_LEVEL: "debug" }))).toThrow(
      "LOG_LEVEL must be one of fatal, error, warn, or info",
    );
  });

  it("requires selected provider configuration in production", () => {
    expect(() => loadEnv(productionEnv({ AUTH_PROVIDER: "" }))).toThrow(
      "AUTH_PROVIDER is required when AUTH_MODE=provider",
    );
    expect(() =>
      loadEnv(productionEnv({ SUPABASE_AUTH_JWKS_URL: "" })),
    ).toThrow("SUPABASE_AUTH_JWKS_URL and SUPABASE_AUTH_ISSUER are required");
  });

  it("does not let provider mode authenticate with mock headers", async () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      AUTH_MODE: "provider",
      AUTH_PROVIDER: "better-auth",
      CORS_ORIGIN: "",
    });
    const app = await createServer({ env });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me?organization_id=evil&workspace_id=evil",
      headers: {
        "x-mock-user-id": "usr_demo_owner",
        "x-mock-organization-id": "org_demo",
        "x-mock-workspace-id": "wks_demo_sales",
        "x-mock-role": "owner",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: {
        code: "UNAUTHENTICATED",
        message: "Authentication is required.",
      },
    });
  });
});
