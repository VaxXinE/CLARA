import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { GmailOAuthConnectService } from "../src/channels/email/gmail-oauth-connect-service";
import { FixtureGmailOAuthStateRepository } from "../src/channels/email/gmail-oauth-state-repository";
import { GmailOAuthStateService } from "../src/channels/email/gmail-oauth-state-service";
import { sha256Base64Url } from "../src/channels/email/gmail-pkce";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function authHeaders(input: {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: "owner" | "agent" | "viewer";
}) {
  return {
    "x-mock-user-id": input.userId,
    "x-mock-organization-id": input.organizationId,
    "x-mock-workspace-id": input.workspaceId,
    "x-mock-role": input.role,
  };
}

function createGmailConnectService() {
  const repository = new FixtureGmailOAuthStateRepository();
  const config = {
    enabled: true,
    tokenVaultMode: "encrypted" as const,
    oauthAuthorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    oauthClientId: "gmail-client-id-placeholder",
    oauthRedirectUri:
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    oauthAllowedRedirectUris: [
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    ],
    oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
    tokenEncryptionKeyBase64: Buffer.alloc(32, 6).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
  };

  const stateService = new GmailOAuthStateService(repository, config, {
    nodeEnv: "test",
  });

  return {
    repository,
    service: new GmailOAuthConnectService(stateService, config, {
      nodeEnv: "test",
    }),
  };
}

describe("gmail oauth connect route", () => {
  it("requires authentication", async () => {
    const { service } = createGmailConnectService();
    const app = await createServer({
      env: testEnv,
      gmailOAuthConnectService: service,
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/oauth/connect",
      payload: {
        redirect_uri:
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        scopes: ["gmail.readonly"],
      },
    });

    await app.close();

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: {
        code: "UNAUTHENTICATED",
      },
    });
  });

  it("creates a safe gmail authorization url for an agent without exposing verifier or nonce", async () => {
    const { service, repository } = createGmailConnectService();
    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    globalThis.fetch = (async () => {
      fetchCalls += 1;
      throw new Error("network should not be called");
    }) as typeof globalThis.fetch;

    try {
      const app = await createServer({
        env: testEnv,
        gmailOAuthConnectService: service,
      });

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/integrations/gmail/oauth/connect",
        headers: authHeaders({
          userId: "usr_demo_agent",
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          role: "agent",
        }),
        payload: {
          redirect_uri:
            "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
          scopes: ["gmail.readonly", "gmail.send"],
        },
      });

      await app.close();

      expect(response.statusCode).toBe(201);
      expect(response.json()).toMatchObject({
        provider: "gmail",
        scopes: ["gmail.readonly", "gmail.send"],
      });
      expect(response.json().authorization_url).toContain("code_challenge=");
      expect(response.json().authorization_url).not.toContain("code_verifier");
      expect(response.json().authorization_url).not.toContain("nonce=");
      expect(response.json().authorization_url).not.toContain("client_secret");
      expect(fetchCalls).toBe(0);

      const authUrl = new URL(response.json().authorization_url);
      const state = authUrl.searchParams.get("state");
      expect(state).toBeTruthy();

      const stored = await repository.findByStateHashScoped(
        {
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
        },
        sha256Base64Url(state ?? ""),
      );

      expect(stored).not.toBeNull();
      expect(stored?.stateHash).not.toBe(state);
      expect(JSON.stringify(stored)).not.toContain(state ?? "");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("rejects unsafe redirect uri, unallowlisted scopes, and viewer role", async () => {
    const { service } = createGmailConnectService();
    const app = await createServer({
      env: testEnv,
      gmailOAuthConnectService: service,
    });

    const unsafeRedirectResponse = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/oauth/connect",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        redirect_uri: "https://evil.example.test/callback",
        scopes: ["gmail.readonly"],
      },
    });

    expect(unsafeRedirectResponse.statusCode).toBe(409);

    const badScopeResponse = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/oauth/connect",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        redirect_uri:
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        scopes: ["gmail.compose"],
      },
    });

    expect(badScopeResponse.statusCode).toBe(409);

    const viewerResponse = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/oauth/connect",
      headers: authHeaders({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
      payload: {
        redirect_uri:
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        scopes: ["gmail.readonly"],
      },
    });

    await app.close();

    expect(viewerResponse.statusCode).toBe(403);
  });
});
