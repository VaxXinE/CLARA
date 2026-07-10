import { describe, expect, it } from "vitest";
import type { Database } from "../src/db/client";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { GmailOAuthCallbackService } from "../src/channels/email/gmail-oauth-callback-service";
import { GmailOAuthConnectService } from "../src/channels/email/gmail-oauth-connect-service";
import { FixtureGmailOAuthStateRepository } from "../src/channels/email/gmail-oauth-state-repository";
import { GmailOAuthStateService } from "../src/channels/email/gmail-oauth-state-service";
import { GmailOAuthTokenExchangeService } from "../src/channels/email/gmail-oauth-token-exchange-service";
import { SimulatedGmailOAuthTokenExchangeClient } from "../src/channels/email/simulated-gmail-oauth-token-exchange-client";
import { EncryptedGmailTokenVaultService } from "../src/channels/email/gmail-token-vault-service";
import { DrizzleGmailTokenVaultRepository } from "../src/channels/email/gmail-token-vault-db-repository";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";

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

function createGmailServices() {
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
    tokenEncryptionKeyBase64: Buffer.alloc(32, 10).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
  };

  const stateService = new GmailOAuthStateService(repository, config, {
    nodeEnv: "test",
  });

  return {
    connectService: new GmailOAuthConnectService(stateService, config, {
      nodeEnv: "test",
    }),
    callbackService: new GmailOAuthCallbackService(stateService),
  };
}

function createEncryptedVaultDatabase(): {
  db: Database;
  rows: Array<Record<string, unknown>>;
} {
  const rows: Array<Record<string, unknown>> = [];

  const db = {
    query: {
      gmailTokenVaultEntries: {
        findFirst: async () =>
          (rows.at(-1) as Record<string, unknown> | undefined) ?? null,
      },
    },
    insert: () => ({
      values: async (values: Record<string, unknown>) => {
        rows.push(values);
      },
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => ({
        where: async () => {
          const lastRow = rows.at(-1);

          if (lastRow) {
            Object.assign(lastRow, values);
          }
        },
      }),
    }),
  } as unknown as Database;

  return {
    db,
    rows,
  };
}

function createGmailCompletionServices(input?: {
  tokenExchangeMode?: "disabled" | "simulated" | "real";
}) {
  const repository = new FixtureGmailOAuthStateRepository();
  const providerAccountRepository = new FixtureGmailProviderAccountRepository();
  const config = {
    enabled: true,
    tokenVaultMode: "encrypted" as const,
    oauthAuthorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    oauthTokenExchangeMode: input?.tokenExchangeMode ?? "simulated",
    oauthClientId: "gmail-client-id-placeholder",
    oauthRedirectUri:
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    oauthAllowedRedirectUris: [
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    ],
    oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
    tokenEncryptionKeyBase64: Buffer.alloc(32, 13).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
  };
  const stateService = new GmailOAuthStateService(repository, config, {
    nodeEnv: "test",
  });
  const { db, rows } = createEncryptedVaultDatabase();
  const tokenExchangeService = new GmailOAuthTokenExchangeService(
    new SimulatedGmailOAuthTokenExchangeClient({
      nodeEnv: "test",
    }),
    new EncryptedGmailTokenVaultService(
      new DrizzleGmailTokenVaultRepository(db),
      config,
      { nodeEnv: "test" },
    ),
    providerAccountRepository,
  );

  return {
    rows,
    connectService: new GmailOAuthConnectService(stateService, config, {
      nodeEnv: "test",
    }),
    callbackService: new GmailOAuthCallbackService(stateService, {
      tokenExchangeMode: input?.tokenExchangeMode ?? "simulated",
      tokenExchangeService,
    }),
  };
}

describe("gmail oauth callback route", () => {
  it("validates callback successfully and does not return code, state, or verifier", async () => {
    const { connectService, callbackService } = createGmailServices();
    const app = await createServer({
      env: testEnv,
      gmailOAuthConnectService: connectService,
      gmailOAuthCallbackService: callbackService,
    });

    const connectResponse = await app.inject({
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
        scopes: ["gmail.readonly"],
      },
    });

    const state = new URL(
      connectResponse.json().authorization_url as string,
    ).searchParams.get("state");

    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    globalThis.fetch = (async () => {
      fetchCalls += 1;
      throw new Error("network should not be called");
    }) as typeof globalThis.fetch;

    try {
      const response = await app.inject({
        method: "GET",
        url: `/api/v1/integrations/gmail/oauth/callback?code=auth-code-demo&state=${encodeURIComponent(
          state ?? "",
        )}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        provider: "gmail",
        status: "pending_token_exchange",
        workspace_id: "wks_demo_sales",
      });
      expect(JSON.stringify(response.json())).not.toContain("auth-code-demo");
      expect(JSON.stringify(response.json())).not.toContain(state ?? "");
      expect(JSON.stringify(response.json())).not.toContain("code_verifier");
      expect(fetchCalls).toBe(0);
    } finally {
      globalThis.fetch = originalFetch;
      await app.close();
    }
  });

  it("rejects reused, expired, missing, and unknown state/code values", async () => {
    const { connectService, callbackService } = createGmailServices();
    const app = await createServer({
      env: testEnv,
      gmailOAuthConnectService: connectService,
      gmailOAuthCallbackService: callbackService,
    });

    const connectResponse = await app.inject({
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
        scopes: ["gmail.readonly"],
      },
    });
    const state = new URL(
      connectResponse.json().authorization_url as string,
    ).searchParams.get("state");

    const firstResponse = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/oauth/callback?code=auth-code-demo&state=${encodeURIComponent(
        state ?? "",
      )}`,
    });
    expect(firstResponse.statusCode).toBe(200);

    const reusedResponse = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/oauth/callback?code=auth-code-demo-2&state=${encodeURIComponent(
        state ?? "",
      )}`,
    });
    expect(reusedResponse.statusCode).toBe(409);

    const missingCodeResponse = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/oauth/callback?state=${encodeURIComponent(
        state ?? "",
      )}`,
    });
    expect(missingCodeResponse.statusCode).toBe(400);

    const missingStateResponse = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/oauth/callback?code=auth-code-demo-3",
    });
    expect(missingStateResponse.statusCode).toBe(400);

    const unknownStateResponse = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/oauth/callback?code=auth-code-demo-4&state=unknown-state",
    });
    expect(unknownStateResponse.statusCode).toBe(404);

    await app.close();
  });

  it("sanitizes provider errors and does not echo error_description", async () => {
    const { connectService, callbackService } = createGmailServices();
    const app = await createServer({
      env: testEnv,
      gmailOAuthConnectService: connectService,
      gmailOAuthCallbackService: callbackService,
    });

    const connectResponse = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/oauth/connect",
      headers: authHeaders({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
      payload: {
        redirect_uri:
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        scopes: ["gmail.readonly", "gmail.send"],
      },
    });
    const state = new URL(
      connectResponse.json().authorization_url as string,
    ).searchParams.get("state");

    const response = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/oauth/callback?error=access_denied&error_description=${encodeURIComponent(
        "secret provider detail",
      )}&state=${encodeURIComponent(state ?? "")}`,
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      provider: "gmail",
      status: "provider_error",
      message: "Gmail connection was cancelled by the provider or user.",
    });
    expect(JSON.stringify(response.json())).not.toContain(
      "secret provider detail",
    );
    expect(JSON.stringify(response.json())).not.toContain(state ?? "");
  });

  it("completes callback in simulated mode and never returns code, state, token, or verifier", async () => {
    const { rows, connectService, callbackService } =
      createGmailCompletionServices({
        tokenExchangeMode: "simulated",
      });
    const app = await createServer({
      env: testEnv,
      gmailOAuthConnectService: connectService,
      gmailOAuthCallbackService: callbackService,
    });

    const connectResponse = await app.inject({
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
    const state = new URL(
      connectResponse.json().authorization_url as string,
    ).searchParams.get("state");

    const response = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/oauth/callback?code=example-completion-route-code&state=${encodeURIComponent(
        state ?? "",
      )}`,
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      provider: "gmail",
      status: "connected",
      account: {
        provider: "gmail",
        emailAddress: "simulated.gmail.account@example.test",
        status: "connected",
      },
    });
    expect(JSON.stringify(response.json())).not.toContain(
      "example-completion-route-code",
    );
    expect(JSON.stringify(response.json())).not.toContain(state ?? "");
    expect(JSON.stringify(response.json())).not.toContain(
      "example-gmail-access-token",
    );
    expect(JSON.stringify(response.json())).not.toContain(
      "example-gmail-refresh-token",
    );
    expect(JSON.stringify(response.json())).not.toContain("code_verifier");
    expect(rows).toHaveLength(1);
  });

  it("fails closed in real mode because real token exchange is not implemented", async () => {
    const { connectService, callbackService } = createGmailCompletionServices({
      tokenExchangeMode: "real",
    });
    const app = await createServer({
      env: testEnv,
      gmailOAuthConnectService: connectService,
      gmailOAuthCallbackService: callbackService,
    });

    const connectResponse = await app.inject({
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
        scopes: ["gmail.readonly"],
      },
    });
    const state = new URL(
      connectResponse.json().authorization_url as string,
    ).searchParams.get("state");

    const response = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/oauth/callback?code=example-real-mode-route-code&state=${encodeURIComponent(
        state ?? "",
      )}`,
    });

    await app.close();

    expect(response.statusCode).toBe(501);
    expect(response.json()).toMatchObject({
      error: {
        message:
          "Real Gmail OAuth token exchange is not enabled in this build.",
      },
    });
  });
});
