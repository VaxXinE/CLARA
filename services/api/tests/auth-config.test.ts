import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

describe("auth configuration", () => {
  it("defaults to mock auth for non-production environments", () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      CORS_ORIGIN: "",
    });

    expect(env.AUTH_MODE).toBe("mock");
    expect(env.MOCK_AUTH_ENABLED).toBe(true);
    expect(env.RATE_LIMIT_ENABLED).toBe(true);
    expect(env.RATE_LIMIT_MAX).toBe(120);
    expect(env.RATE_LIMIT_WINDOW_MS).toBe(60_000);
    expect(env.AI_DRAFT_RATE_LIMIT_MAX).toBe(20);
    expect(env.REPLY_SEND_RATE_LIMIT_MAX).toBe(30);
    expect(env.REQUEST_BODY_LIMIT_BYTES).toBe(1_048_576);
  });

  it("accepts explicit rate limiting and request body limit overrides", () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      RATE_LIMIT_ENABLED: "false",
      RATE_LIMIT_MAX: "200",
      RATE_LIMIT_WINDOW_MS: "30000",
      AI_DRAFT_RATE_LIMIT_MAX: "10",
      REPLY_SEND_RATE_LIMIT_MAX: "15",
      REQUEST_BODY_LIMIT_BYTES: "4096",
      CORS_ORIGIN: "",
    });

    expect(env.RATE_LIMIT_ENABLED).toBe(false);
    expect(env.RATE_LIMIT_MAX).toBe(200);
    expect(env.RATE_LIMIT_WINDOW_MS).toBe(30_000);
    expect(env.AI_DRAFT_RATE_LIMIT_MAX).toBe(10);
    expect(env.REPLY_SEND_RATE_LIMIT_MAX).toBe(15);
    expect(env.REQUEST_BODY_LIMIT_BYTES).toBe(4096);
  });

  it("rejects mock mode when mock auth is explicitly disabled", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "test",
        APP_NAME: "clara-api-test",
        HOST: "127.0.0.1",
        PORT: "3000",
        LOG_LEVEL: "silent",
        AUTH_MODE: "mock",
        MOCK_AUTH_ENABLED: "false",
        CORS_ORIGIN: "",
      }),
    ).toThrow("AUTH_MODE=mock requires MOCK_AUTH_ENABLED=true");
  });

  it("requires AUTH_PROVIDER when provider mode is selected", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "test",
        APP_NAME: "clara-api-test",
        HOST: "127.0.0.1",
        PORT: "3000",
        LOG_LEVEL: "silent",
        AUTH_MODE: "provider",
        CORS_ORIGIN: "",
      }),
    ).toThrow("AUTH_PROVIDER is required when AUTH_MODE=provider");
  });

  it("rejects mock mode in production even when mock auth is disabled", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "production",
        APP_NAME: "clara-api",
        HOST: "127.0.0.1",
        PORT: "3000",
        LOG_LEVEL: "info",
        AUTH_MODE: "mock",
        MOCK_AUTH_ENABLED: "false",
        CORS_ORIGIN: "",
      }),
    ).toThrow("AUTH_MODE=mock is not allowed in production");
  });

  it("rejects provider mode in production when Supabase config is missing", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "production",
        APP_NAME: "clara-api",
        HOST: "127.0.0.1",
        PORT: "3000",
        LOG_LEVEL: "info",
        AUTH_MODE: "provider",
        AUTH_PROVIDER: "supabase",
        MOCK_AUTH_ENABLED: "false",
        CORS_ORIGIN: "",
      }),
    ).toThrow(
      "SUPABASE_AUTH_JWKS_URL and SUPABASE_AUTH_ISSUER are required when AUTH_PROVIDER=supabase",
    );
  });

  it("rejects provider mode in production when Better Auth config is missing", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "production",
        APP_NAME: "clara-api",
        HOST: "127.0.0.1",
        PORT: "3000",
        LOG_LEVEL: "info",
        AUTH_MODE: "provider",
        AUTH_PROVIDER: "better-auth",
        MOCK_AUTH_ENABLED: "false",
        CORS_ORIGIN: "",
      }),
    ).toThrow(
      "BETTER_AUTH_BASE_URL is required for AUTH_PROVIDER=better-auth in production",
    );
  });

  it("accepts provider mode in production with required Supabase config", () => {
    const env = loadEnv({
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
      CORS_ORIGIN: "",
    });

    expect(env.AUTH_MODE).toBe("provider");
    expect(env.AUTH_PROVIDER).toBe("supabase");
    expect(env.MOCK_AUTH_ENABLED).toBe(false);
  });

  it("fails closed in provider mode when authentication is missing", async () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      AUTH_MODE: "provider",
      AUTH_PROVIDER: "supabase",
      SUPABASE_AUTH_JWKS_URL: "http://127.0.0.1:65535/.well-known/jwks.json",
      SUPABASE_AUTH_ISSUER: "https://example.supabase.test/auth/v1",
      CORS_ORIGIN: "",
    });
    const app = await createServer({ env });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
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

  it("does not accept arbitrary bearer tokens in provider mode", async () => {
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
      url: "/api/v1/me",
      headers: {
        authorization: "Bearer arbitrary-token",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(501);
    expect(response.json()).toMatchObject({
      error: {
        code: "AUTH_PROVIDER_NOT_IMPLEMENTED",
        message:
          "Provider authentication for better-auth is not implemented yet.",
      },
    });
  });

  it("requires Supabase JWKS and issuer config whenever AUTH_PROVIDER=supabase is selected", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "test",
        APP_NAME: "clara-api-test",
        HOST: "127.0.0.1",
        PORT: "3000",
        LOG_LEVEL: "silent",
        AUTH_MODE: "provider",
        AUTH_PROVIDER: "supabase",
        CORS_ORIGIN: "",
      }),
    ).toThrow(
      "SUPABASE_AUTH_JWKS_URL and SUPABASE_AUTH_ISSUER are required when AUTH_PROVIDER=supabase",
    );
  });
});
