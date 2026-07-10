import { describe, expect, it } from "vitest";
import { createGmailOAuthTokenExchangeClient } from "../src/channels/email/gmail-oauth-token-exchange-client";
import { SimulatedGmailOAuthTokenExchangeClient } from "../src/channels/email/simulated-gmail-oauth-token-exchange-client";

describe("SimulatedGmailOAuthTokenExchangeClient", () => {
  it("returns a deterministic safe token exchange result without network calls", async () => {
    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    globalThis.fetch = (async () => {
      fetchCalls += 1;
      throw new Error("network should not be called");
    }) as typeof globalThis.fetch;

    try {
      const client = new SimulatedGmailOAuthTokenExchangeClient({
        nodeEnv: "test",
      });

      const result = await client.exchangeAuthorizationCode({
        authorizationCode: "example-authorization-code",
        codeVerifier: "example-pkce-verifier",
        redirectUri:
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        scopes: ["gmail.send", "gmail.readonly"],
      });

      expect(result).toMatchObject({
        emailAddress: "simulated.gmail.account@example.test",
        displayName: "Simulated Gmail Account",
        scopes: ["gmail.readonly", "gmail.send"],
        metadata: {
          mailboxType: "google_workspace",
          connectionOrigin: "test",
        },
      });
      expect(result.tokenGrant.accessToken).toBe("example-gmail-access-token");
      expect(result.tokenGrant.refreshToken).toBe(
        "example-gmail-refresh-token",
      );
      expect(fetchCalls).toBe(0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("is blocked in production mode", () => {
    expect(
      () =>
        new SimulatedGmailOAuthTokenExchangeClient({
          nodeEnv: "production",
        }),
    ).toThrow(
      "Simulated Gmail OAuth token exchange client is not allowed in production.",
    );
  });

  it("factory returns null for disabled mode and simulated client for simulated mode", () => {
    expect(
      createGmailOAuthTokenExchangeClient({
        enabled: true,
        tokenVaultMode: "encrypted",
        oauthAuthorizationEndpoint:
          "https://accounts.google.com/o/oauth2/v2/auth",
        oauthTokenExchangeMode: "disabled",
        oauthAllowedRedirectUris: [
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        ],
        oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
        oauthClientId: "gmail-client-id-placeholder",
        tokenEncryptionKeyBase64: Buffer.alloc(32, 7).toString("base64"),
        tokenEncryptionKeyVersion: "v1",
      }),
    ).toBeNull();

    const simulatedClient = createGmailOAuthTokenExchangeClient(
      {
        enabled: true,
        tokenVaultMode: "encrypted",
        oauthAuthorizationEndpoint:
          "https://accounts.google.com/o/oauth2/v2/auth",
        oauthTokenExchangeMode: "simulated",
        oauthAllowedRedirectUris: [
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        ],
        oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
        oauthClientId: "gmail-client-id-placeholder",
        tokenEncryptionKeyBase64: Buffer.alloc(32, 7).toString("base64"),
        tokenEncryptionKeyVersion: "v1",
      },
      {
        nodeEnv: "test",
      },
    );

    expect(simulatedClient).toBeInstanceOf(
      SimulatedGmailOAuthTokenExchangeClient,
    );
  });
});
