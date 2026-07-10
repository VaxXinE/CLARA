import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { GmailOAuthConnectService } from "../src/channels/email/gmail-oauth-connect-service";
import { FixtureGmailOAuthStateRepository } from "../src/channels/email/gmail-oauth-state-repository";
import { GmailOAuthStateService } from "../src/channels/email/gmail-oauth-state-service";
import { sha256Base64Url } from "../src/channels/email/gmail-pkce";

function createService(repository = new FixtureGmailOAuthStateRepository()) {
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
    tokenEncryptionKeyBase64: Buffer.alloc(32, 8).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
  };

  const stateService = new GmailOAuthStateService(repository, config, {
    nodeEnv: "test",
    defaultTtlMs: 5 * 60 * 1000,
  });

  return {
    repository,
    service: new GmailOAuthConnectService(stateService, config, {
      nodeEnv: "test",
    }),
  };
}

describe("GmailOAuthConnectService", () => {
  it("creates a safe authorization url and persists only hashed state", async () => {
    const { service, repository } = createService();

    const result = await service.createAuthorizationUrl({
      auth: buildAuthContext({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      redirectUri:
        "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
      scopes: ["gmail.readonly", "gmail.send"],
    });

    expect(result.provider).toBe("gmail");
    expect(result.authorization_url).toContain(
      "https://accounts.google.com/o/oauth2/v2/auth?",
    );
    expect(result.authorization_url).toContain("code_challenge=");
    expect(result.authorization_url).toContain("code_challenge_method=S256");
    expect(result.authorization_url).not.toContain("code_verifier");
    expect(result.authorization_url).not.toContain("nonce=");
    expect(result.authorization_url).not.toContain("client_secret");

    const state = new URL(result.authorization_url).searchParams.get("state");
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
  });

  it("rejects unallowlisted scopes and unsafe redirect uri", async () => {
    const { service } = createService();
    const auth = buildAuthContext({
      userId: "usr_demo_agent",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      role: "agent",
    });

    await expect(
      service.createAuthorizationUrl({
        auth,
        redirectUri: "https://evil.example.test/callback",
        scopes: ["gmail.readonly"],
      }),
    ).rejects.toThrow("redirect URI is not allowed");

    await expect(
      service.createAuthorizationUrl({
        auth,
        redirectUri:
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        scopes: ["gmail.compose"],
      }),
    ).rejects.toThrow("scopes are not allowed");
  });

  it("forbids viewer from initiating Gmail connect", async () => {
    const { service } = createService();

    await expect(
      service.createAuthorizationUrl({
        auth: buildAuthContext({
          userId: "usr_demo_viewer",
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          role: "viewer",
        }),
      }),
    ).rejects.toThrow("permission");
  });
});
