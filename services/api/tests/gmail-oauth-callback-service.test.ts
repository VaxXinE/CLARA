import { describe, expect, it } from "vitest";
import { GmailOAuthCallbackService } from "../src/channels/email/gmail-oauth-callback-service";
import { FixtureGmailOAuthStateRepository } from "../src/channels/email/gmail-oauth-state-repository";
import { GmailOAuthStateService } from "../src/channels/email/gmail-oauth-state-service";
import { sha256Base64Url } from "../src/channels/email/gmail-pkce";

function createServices() {
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
    tokenEncryptionKeyBase64: Buffer.alloc(32, 7).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
  };

  const stateService = new GmailOAuthStateService(repository, config, {
    nodeEnv: "test",
    defaultTtlMs: 5 * 60 * 1000,
  });

  return {
    repository,
    stateService,
    callbackService: new GmailOAuthCallbackService(stateService),
  };
}

describe("GmailOAuthCallbackService", () => {
  it("validates callback, consumes state once, and never returns secret values", async () => {
    const { repository, stateService, callbackService } = createServices();
    const intent = await stateService.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      redirectUri:
        "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
      scopes: ["gmail.readonly", "gmail.send"],
      now: new Date("2026-07-10T10:00:00.000Z"),
    });

    const result = await callbackService.validateCallback({
      code: "authorization-code-demo",
      state: intent.state,
      now: new Date("2026-07-10T10:01:00.000Z"),
    });

    expect(result).toMatchObject({
      provider: "gmail",
      status: "pending_token_exchange",
      workspace_id: "wks_demo_sales",
    });
    expect(JSON.stringify(result)).not.toContain("authorization-code-demo");
    expect(JSON.stringify(result)).not.toContain(intent.state);
    expect(JSON.stringify(result)).not.toContain("codeVerifier");

    const stored = await repository.findByStateHash(
      sha256Base64Url(intent.state),
    );

    expect(stored?.status).toBe("consumed");
    expect(stored?.consumedAt?.toISOString()).toBe("2026-07-10T10:01:00.000Z");
    expect(JSON.stringify(stored)).not.toContain("authorization-code-demo");
  });

  it("rejects reused, expired, unknown, and missing callback parameters", async () => {
    const { stateService, callbackService } = createServices();
    const intent = await stateService.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      redirectUri:
        "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
      scopes: ["gmail.readonly"],
      now: new Date("2026-07-10T10:00:00.000Z"),
    });

    await callbackService.validateCallback({
      code: "authorization-code-demo",
      state: intent.state,
      now: new Date("2026-07-10T10:00:30.000Z"),
    });

    await expect(
      callbackService.validateCallback({
        code: "authorization-code-demo-2",
        state: intent.state,
        now: new Date("2026-07-10T10:01:00.000Z"),
      }),
    ).rejects.toThrow("already been consumed");

    const expiredIntent = await stateService.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      redirectUri:
        "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
      scopes: ["gmail.readonly"],
      now: new Date("2026-07-10T10:00:00.000Z"),
    });

    await expect(
      callbackService.validateCallback({
        code: "authorization-code-demo-3",
        state: expiredIntent.state,
        now: new Date("2026-07-10T10:06:00.000Z"),
      }),
    ).rejects.toThrow("has expired");

    await expect(
      callbackService.validateCallback({
        code: "authorization-code-demo-4",
        state: "unknown-state",
      }),
    ).rejects.toThrow("state not found");

    await expect(
      callbackService.validateCallback({
        state: intent.state,
      }),
    ).rejects.toThrow("Missing required OAuth callback code");

    await expect(
      callbackService.validateCallback({
        code: "authorization-code-demo-5",
      }),
    ).rejects.toThrow("Missing required OAuth callback state");
  });

  it("sanitizes provider errors, revokes known state, and does not make network calls", async () => {
    const { repository, stateService, callbackService } = createServices();
    const intent = await stateService.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_owner",
      actorRole: "owner",
      redirectUri:
        "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
      scopes: ["gmail.readonly"],
      now: new Date("2026-07-10T10:00:00.000Z"),
    });
    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    globalThis.fetch = (async () => {
      fetchCalls += 1;
      throw new Error("network should not be called");
    }) as typeof globalThis.fetch;

    try {
      const result = await callbackService.validateCallback({
        error: "access_denied",
        errorDescription: "this should never be echoed",
        state: intent.state,
        now: new Date("2026-07-10T10:00:10.000Z"),
      });

      expect(result).toEqual({
        provider: "gmail",
        status: "provider_error",
        message: "Gmail connection was cancelled by the provider or user.",
      });
      expect(JSON.stringify(result)).not.toContain(
        "this should never be echoed",
      );
      expect(fetchCalls).toBe(0);

      const stored = await repository.findByStateHash(
        sha256Base64Url(intent.state),
      );

      expect(stored?.status).toBe("revoked");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
