import { describe, expect, it } from "vitest";
import { extractBearerToken } from "../src/auth/bearer-token";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

function buildProviderEnv() {
  return loadEnv({
    NODE_ENV: "test",
    APP_NAME: "clara-api-test",
    HOST: "127.0.0.1",
    PORT: "3000",
    LOG_LEVEL: "silent",
    AUTH_MODE: "provider",
    AUTH_PROVIDER: "supabase",
    CORS_ORIGIN: "",
  });
}

describe("extractBearerToken", () => {
  it("returns the token for a valid bearer header", () => {
    expect(extractBearerToken("Bearer test-token")).toBe("test-token");
    expect(extractBearerToken("bearer second-token")).toBe("second-token");
  });

  it("rejects missing or malformed authorization headers", () => {
    expect(() => extractBearerToken(undefined)).toThrow(
      "Authentication is required.",
    );
    expect(() => extractBearerToken("")).toThrow("Authentication is required.");
    expect(() => extractBearerToken("Basic abc123")).toThrow(
      "Authentication is required.",
    );
    expect(() => extractBearerToken("Bearer")).toThrow(
      "Authentication is required.",
    );
    expect(() => extractBearerToken("Bearer    ")).toThrow(
      "Authentication is required.",
    );
    expect(() => extractBearerToken("Bearer token extra")).toThrow(
      "Authentication is required.",
    );
  });
});

describe("requireAuth provider mode", () => {
  it("returns 401 when the authorization header is missing", async () => {
    const app = await createServer({ env: buildProviderEnv() });

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

  it("returns 401 for malformed bearer headers", async () => {
    const app = await createServer({ env: buildProviderEnv() });

    const responses = await Promise.all(
      ["Basic abc123", "Bearer", "Bearer token extra"].map((authorization) =>
        app.inject({
          method: "GET",
          url: "/api/v1/me",
          headers: {
            authorization,
          },
        }),
      ),
    );

    await app.close();

    for (const response of responses) {
      expect(response.statusCode).toBe(401);
      expect(response.json()).toMatchObject({
        error: {
          code: "UNAUTHENTICATED",
          message: "Authentication is required.",
        },
      });
    }
  });

  it("does not allow mock headers to authenticate requests in provider mode", async () => {
    const app = await createServer({ env: buildProviderEnv() });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: {
        "x-mock-user-id": "user_owner_01",
        "x-mock-organization-id": "org_01",
        "x-mock-workspace-id": "ws_01",
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

  it("fails closed after token extraction when provider verification is not implemented", async () => {
    const app = await createServer({ env: buildProviderEnv() });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: {
        authorization: "Bearer real-looking-token",
        "x-mock-user-id": "user_owner_01",
        "x-mock-organization-id": "org_01",
        "x-mock-workspace-id": "ws_01",
        "x-mock-role": "owner",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(501);
    expect(response.json()).toMatchObject({
      error: {
        code: "AUTH_PROVIDER_NOT_IMPLEMENTED",
        message: "Provider authentication for supabase is not implemented yet.",
      },
    });
  });
});
