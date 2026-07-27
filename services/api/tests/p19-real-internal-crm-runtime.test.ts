import { describe, expect, it } from "vitest";
import { createAuthProvider } from "../src/auth/auth-provider";
import { SupabaseJwtVerifier } from "../src/auth/supabase-jwt-verifier";
import { FixtureWorkspaceMembershipRepository } from "../src/auth/workspace-membership-repository";
import { WorkspaceMembershipService } from "../src/auth/workspace-membership-service";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { createSupabaseJwksTestContext } from "./support/supabase-jwt-test-helpers";

async function createProviderServer() {
  const jwksContext = await createSupabaseJwksTestContext();
  const env = loadEnv({
    NODE_ENV: "test",
    APP_NAME: "clara-api-test",
    HOST: "127.0.0.1",
    PORT: "3000",
    LOG_LEVEL: "silent",
    AUTH_MODE: "provider",
    AUTH_PROVIDER: "supabase",
    MOCK_AUTH_ENABLED: "false",
    SUPABASE_AUTH_JWKS_URL: jwksContext.jwksUrl,
    SUPABASE_AUTH_ISSUER: jwksContext.issuer,
    CORS_ORIGIN: "",
  });
  const app = await createServer({
    env,
    authProvider: createAuthProvider(env, {
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

  return { app, jwksContext };
}

describe("P19 real internal CRM runtime", () => {
  it("uses provider AuthContext for CRM reads", async () => {
    const { app, jwksContext } = await createProviderServer();
    const token = await jwksContext.signToken({
      subject: "subject_demo_agent",
      email: "agent@example.test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().data[0]).toMatchObject({
      id: "cust_demo_budi",
    });
    expect(response.body).not.toContain("access_token");
    expect(response.body).not.toContain("refresh_token");
    expect(response.body).not.toContain("raw_provider");
  });

  it("rejects client-supplied workspace authority safely in provider CRM reads", async () => {
    const { app, jwksContext } = await createProviderServer();
    const token = await jwksContext.signToken({
      subject: "subject_demo_agent",
      email: "agent@example.test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers?workspaceId=wks_spoof&organization_id=org_spoof",
      headers: {
        authorization: `Bearer ${token}`,
        "x-mock-user-id": "usr_spoof",
        "x-mock-role": "owner",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.body).not.toContain("cust_demo_budi");
    expect(response.body).not.toContain("access_token");
    expect(response.body).not.toContain("raw_provider");
  });

  it("allows provider-authenticated agents to create notes", async () => {
    const { app, jwksContext } = await createProviderServer();
    const token = await jwksContext.signToken({
      subject: "subject_demo_agent",
      email: "agent@example.test",
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/notes",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        body: "Provider-authenticated internal CRM note.",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      note: {
        customer_id: "cust_demo_budi",
        author_user_id: "usr_demo_agent",
      },
    });
    expect(JSON.stringify(response.json())).not.toContain("wks_spoof");
  });

  it("keeps provider-authenticated viewers read-only for CRM mutations", async () => {
    const { app, jwksContext } = await createProviderServer();
    const token = await jwksContext.signToken({
      subject: "subject_demo_viewer",
      email: "viewer@example.test",
    });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/lifecycle-status",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        status: "active",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
    expect(response.body).not.toContain("access_token");
    expect(response.body).not.toContain("raw_provider");
  });
});
