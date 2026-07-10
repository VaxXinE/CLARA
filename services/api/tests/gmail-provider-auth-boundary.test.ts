import { describe, expect, it } from "vitest";
import { GmailProviderAccountService } from "../src/channels/email/gmail-provider-account-service";
import { MockGmailTokenVault } from "../src/channels/email/mock-gmail-token-vault";
import {
  loadGmailProviderConfig,
  validateGmailProviderConfig,
} from "../src/channels/email/gmail-provider-config";

describe("GmailProviderAccountService", () => {
  it("creates a provider account public DTO with allowlisted metadata only", async () => {
    const service = new GmailProviderAccountService(new MockGmailTokenVault());

    const account = await service.createConnectedAccount({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      emailAddress: "Agent.Gmail@example.test",
      displayName: " Demo Agent Gmail ",
      scopes: ["gmail.send", "gmail.readonly", "gmail.send"],
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "manual",
        // @ts-expect-error runtime sanitization test
        accessToken: "must-not-survive",
      },
      tokenGrant: {
        accessToken: "gmail-access-token-demo",
        refreshToken: "gmail-refresh-token-demo",
        expiresAt: new Date("2026-07-10T12:30:00.000Z"),
      },
    });

    expect(account).toMatchObject({
      provider: "gmail",
      emailAddress: "agent.gmail@example.test",
      displayName: "Demo Agent Gmail",
      status: "connected",
      scopes: ["gmail.readonly", "gmail.send"],
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "manual",
      },
    });
    expect(JSON.stringify(account)).not.toContain("gmail-access-token-demo");
    expect(JSON.stringify(account)).not.toContain("gmail-refresh-token-demo");
    expect(JSON.stringify(account)).not.toContain("must-not-survive");
  });

  it("fails closed for cross-workspace account reads", async () => {
    const service = new GmailProviderAccountService(new MockGmailTokenVault());
    const account = await service.createConnectedAccount({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      emailAddress: "agent.workspace@example.test",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "workspace-access-token",
        refreshToken: "workspace-refresh-token",
        expiresAt: null,
      },
    });

    await expect(
      service.getPublicAccount({
        organizationId: "org_demo_other",
        workspaceId: "wks_demo_other",
        accountId: account.id,
      }),
    ).rejects.toThrow("Gmail provider account not found.");
  });

  it("never exposes token values through public DTOs or debug service state", async () => {
    const vault = new MockGmailTokenVault();
    const service = new GmailProviderAccountService(vault);

    const account = await service.createConnectedAccount({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      emailAddress: "dto.safety@example.test",
      scopes: ["gmail.send"],
      tokenGrant: {
        accessToken: "dto-access-token",
        refreshToken: "dto-refresh-token",
        expiresAt: null,
      },
    });
    const vaultSnapshot = vault.getDebugSnapshot();

    expect(JSON.stringify(account)).not.toContain("dto-access-token");
    expect(JSON.stringify(account)).not.toContain("dto-refresh-token");
    expect(JSON.stringify(vaultSnapshot)).not.toContain("dto-access-token");
    expect(JSON.stringify(vaultSnapshot)).not.toContain("dto-refresh-token");
    expect(vaultSnapshot[0]).not.toHaveProperty("accessToken");
    expect(vaultSnapshot[0]).not.toHaveProperty("refreshToken");
  });

  it("can revoke a scoped provider account without any real provider network call", async () => {
    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    globalThis.fetch = (async () => {
      fetchCalls += 1;
      throw new Error("network should not be called");
    }) as typeof globalThis.fetch;

    try {
      const service = new GmailProviderAccountService(
        new MockGmailTokenVault(),
      );
      const account = await service.createConnectedAccount({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        emailAddress: "revoke@example.test",
        scopes: ["gmail.readonly"],
        tokenGrant: {
          accessToken: "revoke-access-token",
          refreshToken: "revoke-refresh-token",
          expiresAt: null,
        },
      });

      const revoked = await service.revokeAccount({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        accountId: account.id,
      });

      expect(revoked.status).toBe("revoked");
      expect(fetchCalls).toBe(0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("rejects duplicate Gmail provider account per workspace email", async () => {
    const service = new GmailProviderAccountService(new MockGmailTokenVault());

    await service.createConnectedAccount({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      emailAddress: "duplicate@example.test",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "duplicate-access-token-1",
        refreshToken: "duplicate-refresh-token-1",
        expiresAt: null,
      },
    });

    await expect(
      service.createConnectedAccount({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        emailAddress: "duplicate@example.test",
        scopes: ["gmail.send"],
        tokenGrant: {
          accessToken: "duplicate-access-token-2",
          refreshToken: "duplicate-refresh-token-2",
          expiresAt: null,
        },
      }),
    ).rejects.toThrow(
      "Gmail provider account already exists for this workspace email.",
    );
  });

  it("can update account status without exposing token data", async () => {
    const service = new GmailProviderAccountService(new MockGmailTokenVault());
    const account = await service.createConnectedAccount({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      emailAddress: "status@example.test",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "status-access-token",
        refreshToken: "status-refresh-token",
        expiresAt: null,
      },
    });

    const updated = await service.updateAccountStatus({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: account.id,
      status: "error",
      lastVerifiedAt: null,
    });

    expect(updated.status).toBe("error");
    expect(updated.lastVerifiedAt).toBeNull();
    expect(JSON.stringify(updated)).not.toContain("status-access-token");
    expect(JSON.stringify(updated)).not.toContain("status-refresh-token");
  });
});

describe("Gmail provider config boundary", () => {
  it("requires an encryption key when non-mock Gmail token storage is configured", () => {
    expect(() =>
      validateGmailProviderConfig(
        {
          enabled: true,
          tokenVaultMode: "encrypted",
          oauthAuthorizationEndpoint:
            "https://accounts.google.com/o/oauth2/v2/auth",
          oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
          tokenEncryptionKeyVersion: "v1",
        },
        { nodeEnv: "development" },
      ),
    ).toThrow("TOKEN_VAULT_ENCRYPTION_KEY_BASE64 is required");
  });

  it("loads Gmail provider config safely from env-like input", () => {
    const config = loadGmailProviderConfig({
      GMAIL_PROVIDER_ENABLED: "true",
      GMAIL_TOKEN_VAULT_MODE: "encrypted",
      GMAIL_OAUTH_TOKEN_EXCHANGE_MODE: "disabled",
      GMAIL_OAUTH_TOKEN_EXCHANGE_TIMEOUT_MS: "15000",
      GMAIL_API_MODE: "disabled",
      GMAIL_API_TIMEOUT_MS: "12000",
      TOKEN_VAULT_ENCRYPTION_KEY_BASE64: Buffer.alloc(32, 9).toString("base64"),
      TOKEN_VAULT_ENCRYPTION_KEY_VERSION: "v2",
      GMAIL_OAUTH_CLIENT_ID: "gmail-client-id-placeholder",
      GMAIL_OAUTH_REDIRECT_URI: "http://127.0.0.1:3000/internal/gmail/redirect",
    });

    expect(config).toEqual({
      enabled: true,
      tokenVaultMode: "encrypted",
      oauthAuthorizationEndpoint:
        "https://accounts.google.com/o/oauth2/v2/auth",
      oauthTokenExchangeMode: "disabled",
      oauthTokenEndpoint: "https://oauth2.googleapis.com/token",
      oauthAllowedRedirectUris: [
        "http://127.0.0.1:3000/internal/gmail/redirect",
      ],
      oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
      oauthTokenExchangeTimeoutMs: 15000,
      apiMode: "disabled",
      apiTimeoutMs: 12000,
      tokenEncryptionKeyBase64: Buffer.alloc(32, 9).toString("base64"),
      tokenEncryptionKeyVersion: "v2",
      oauthClientId: "gmail-client-id-placeholder",
      oauthRedirectUri: "http://127.0.0.1:3000/internal/gmail/redirect",
    });
  });

  it("blocks simulated Gmail OAuth token exchange mode in production", () => {
    expect(() =>
      validateGmailProviderConfig(
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
          tokenEncryptionKeyBase64: Buffer.alloc(32, 9).toString("base64"),
          tokenEncryptionKeyVersion: "v2",
        },
        { nodeEnv: "production" },
      ),
    ).toThrow(
      "simulated Gmail OAuth token exchange is not allowed in production",
    );
  });

  it("requires client secret when real Gmail OAuth token exchange is configured", () => {
    expect(() =>
      validateGmailProviderConfig(
        {
          enabled: true,
          tokenVaultMode: "encrypted",
          oauthAuthorizationEndpoint:
            "https://accounts.google.com/o/oauth2/v2/auth",
          oauthTokenExchangeMode: "real",
          oauthAllowedRedirectUris: [
            "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
          ],
          oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
          oauthClientId: "gmail-client-id-placeholder",
          tokenEncryptionKeyBase64: Buffer.alloc(32, 9).toString("base64"),
          tokenEncryptionKeyVersion: "v2",
        },
        { nodeEnv: "production" },
      ),
    ).toThrow(
      "GMAIL_OAUTH_CLIENT_SECRET is required when real Gmail OAuth token exchange is configured",
    );
  });

  it("blocks mocked Gmail API mode in production", () => {
    expect(() =>
      validateGmailProviderConfig(
        {
          enabled: true,
          tokenVaultMode: "encrypted",
          oauthAuthorizationEndpoint:
            "https://accounts.google.com/o/oauth2/v2/auth",
          oauthAllowedRedirectUris: [
            "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
          ],
          oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
          apiMode: "mocked",
          tokenEncryptionKeyBase64: Buffer.alloc(32, 9).toString("base64"),
          tokenEncryptionKeyVersion: "v2",
          oauthClientId: "gmail-client-id-placeholder",
        },
        { nodeEnv: "production" },
      ),
    ).toThrow("mocked Gmail API mode is not allowed in production");
  });

  it("requires base URL when real Gmail API mode is configured", () => {
    expect(() =>
      validateGmailProviderConfig(
        {
          enabled: true,
          tokenVaultMode: "encrypted",
          oauthAuthorizationEndpoint:
            "https://accounts.google.com/o/oauth2/v2/auth",
          oauthAllowedRedirectUris: [
            "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
          ],
          oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
          apiMode: "real",
          tokenEncryptionKeyBase64: Buffer.alloc(32, 9).toString("base64"),
          tokenEncryptionKeyVersion: "v2",
          oauthClientId: "gmail-client-id-placeholder",
        },
        { nodeEnv: "production" },
      ),
    ).toThrow(
      "GMAIL_API_BASE_URL is required when real Gmail API mode is configured",
    );
  });
});
