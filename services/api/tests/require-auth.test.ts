import { describe, expect, it } from "vitest";
import { createAuthProvider } from "../src/auth/auth-provider";
import { extractBearerToken } from "../src/auth/bearer-token";
import { SupabaseJwtVerifier } from "../src/auth/supabase-jwt-verifier";
import { FixtureWorkspaceMembershipRepository } from "../src/auth/workspace-membership-repository";
import { WorkspaceMembershipService } from "../src/auth/workspace-membership-service";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { createSupabaseJwksTestContext } from "./support/supabase-jwt-test-helpers";

function buildProviderEnv(input: { jwksUrl: string; issuer: string }) {
  return loadEnv({
    NODE_ENV: "test",
    APP_NAME: "clara-api-test",
    HOST: "127.0.0.1",
    PORT: "3000",
    LOG_LEVEL: "silent",
    AUTH_MODE: "provider",
    AUTH_PROVIDER: "supabase",
    SUPABASE_AUTH_JWKS_URL: input.jwksUrl,
    SUPABASE_AUTH_ISSUER: input.issuer,
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
    const jwksContext = await createSupabaseJwksTestContext();
    const app = await createServer({
      env: buildProviderEnv(jwksContext),
      authProvider: createAuthProvider(buildProviderEnv(jwksContext), {
        workspaceMembershipService: new WorkspaceMembershipService(
          new FixtureWorkspaceMembershipRepository(),
        ),
        providerIdentityVerifier: new SupabaseJwtVerifier(
          {
            mode: "provider",
            provider: "supabase",
            jwksUrl: jwksContext.jwksUrl,
            issuer: jwksContext.issuer,
          },
          jwksContext.jwks,
        ),
      }),
    });

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
    const jwksContext = await createSupabaseJwksTestContext();
    const app = await createServer({
      env: buildProviderEnv(jwksContext),
      authProvider: createAuthProvider(buildProviderEnv(jwksContext), {
        workspaceMembershipService: new WorkspaceMembershipService(
          new FixtureWorkspaceMembershipRepository(),
        ),
        providerIdentityVerifier: new SupabaseJwtVerifier(
          {
            mode: "provider",
            provider: "supabase",
            jwksUrl: jwksContext.jwksUrl,
            issuer: jwksContext.issuer,
          },
          jwksContext.jwks,
        ),
      }),
    });

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
    const jwksContext = await createSupabaseJwksTestContext();
    const app = await createServer({
      env: buildProviderEnv(jwksContext),
      authProvider: createAuthProvider(buildProviderEnv(jwksContext), {
        workspaceMembershipService: new WorkspaceMembershipService(
          new FixtureWorkspaceMembershipRepository(),
        ),
        providerIdentityVerifier: new SupabaseJwtVerifier(
          {
            mode: "provider",
            provider: "supabase",
            jwksUrl: jwksContext.jwksUrl,
            issuer: jwksContext.issuer,
          },
          jwksContext.jwks,
        ),
      }),
    });

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

  it("returns 401 for an invalid JWT", async () => {
    const jwksContext = await createSupabaseJwksTestContext();
    const app = await createServer({
      env: buildProviderEnv(jwksContext),
      authProvider: createAuthProvider(buildProviderEnv(jwksContext), {
        workspaceMembershipService: new WorkspaceMembershipService(
          new FixtureWorkspaceMembershipRepository(),
        ),
        providerIdentityVerifier: new SupabaseJwtVerifier(
          {
            mode: "provider",
            provider: "supabase",
            jwksUrl: jwksContext.jwksUrl,
            issuer: jwksContext.issuer,
          },
          jwksContext.jwks,
        ),
      }),
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: {
        authorization: "Bearer not-a-jwt",
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

  it("returns 401 for an expired JWT", async () => {
    const jwksContext = await createSupabaseJwksTestContext();
    const app = await createServer({
      env: buildProviderEnv(jwksContext),
      authProvider: createAuthProvider(buildProviderEnv(jwksContext), {
        workspaceMembershipService: new WorkspaceMembershipService(
          new FixtureWorkspaceMembershipRepository(),
        ),
        providerIdentityVerifier: new SupabaseJwtVerifier(
          {
            mode: "provider",
            provider: "supabase",
            jwksUrl: jwksContext.jwksUrl,
            issuer: jwksContext.issuer,
          },
          jwksContext.jwks,
        ),
      }),
    });
    const token = await jwksContext.signToken({
      subject: "subject_demo_agent",
      expirationTime: -60,
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: {
        authorization: `Bearer ${token}`,
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

  it("returns 401 for a JWT with the wrong issuer", async () => {
    const jwksContext = await createSupabaseJwksTestContext();
    const app = await createServer({
      env: buildProviderEnv(jwksContext),
      authProvider: createAuthProvider(buildProviderEnv(jwksContext), {
        workspaceMembershipService: new WorkspaceMembershipService(
          new FixtureWorkspaceMembershipRepository(),
        ),
        providerIdentityVerifier: new SupabaseJwtVerifier(
          {
            mode: "provider",
            provider: "supabase",
            jwksUrl: jwksContext.jwksUrl,
            issuer: jwksContext.issuer,
          },
          jwksContext.jwks,
        ),
      }),
    });
    const token = await jwksContext.signToken({
      subject: "subject_demo_agent",
      issuer: "https://wrong-issuer.example.test/auth/v1",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: {
        authorization: `Bearer ${token}`,
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

  it("returns 200 and resolves provider auth context for a valid JWT with active membership", async () => {
    const jwksContext = await createSupabaseJwksTestContext();
    const app = await createServer({
      env: buildProviderEnv(jwksContext),
      authProvider: createAuthProvider(buildProviderEnv(jwksContext), {
        workspaceMembershipService: new WorkspaceMembershipService(
          new FixtureWorkspaceMembershipRepository(),
        ),
        providerIdentityVerifier: new SupabaseJwtVerifier(
          {
            mode: "provider",
            provider: "supabase",
            jwksUrl: jwksContext.jwksUrl,
            issuer: jwksContext.issuer,
          },
          jwksContext.jwks,
        ),
      }),
    });
    const token = await jwksContext.signToken({
      subject: "subject_demo_agent",
      email: "agent@example.test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      user: {
        id: "usr_demo_agent",
        role: "agent",
      },
      organization: {
        id: "org_demo",
      },
      workspace: {
        id: "wks_demo_sales",
      },
      auth: {
        method: "provider",
      },
    });
  });

  it("returns 403 for a valid JWT without an active workspace membership", async () => {
    const jwksContext = await createSupabaseJwksTestContext();
    const app = await createServer({
      env: buildProviderEnv(jwksContext),
      authProvider: createAuthProvider(buildProviderEnv(jwksContext), {
        workspaceMembershipService: new WorkspaceMembershipService(
          new FixtureWorkspaceMembershipRepository(),
        ),
        providerIdentityVerifier: new SupabaseJwtVerifier(
          {
            mode: "provider",
            provider: "supabase",
            jwksUrl: jwksContext.jwksUrl,
            issuer: jwksContext.issuer,
          },
          jwksContext.jwks,
        ),
      }),
    });
    const token = await jwksContext.signToken({
      subject: "subject_demo_no_membership",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      error: {
        code: "FORBIDDEN",
        message: "You do not have access to this workspace.",
      },
    });
  });

  it("returns 403 for a valid JWT with an inactive membership", async () => {
    const jwksContext = await createSupabaseJwksTestContext();
    const app = await createServer({
      env: buildProviderEnv(jwksContext),
      authProvider: createAuthProvider(buildProviderEnv(jwksContext), {
        workspaceMembershipService: new WorkspaceMembershipService(
          new FixtureWorkspaceMembershipRepository(),
        ),
        providerIdentityVerifier: new SupabaseJwtVerifier(
          {
            mode: "provider",
            provider: "supabase",
            jwksUrl: jwksContext.jwksUrl,
            issuer: jwksContext.issuer,
          },
          jwksContext.jwks,
        ),
      }),
    });
    const token = await jwksContext.signToken({
      subject: "subject_demo_inactive_membership",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      error: {
        code: "FORBIDDEN",
        message: "You do not have access to this workspace.",
      },
    });
  });
});
