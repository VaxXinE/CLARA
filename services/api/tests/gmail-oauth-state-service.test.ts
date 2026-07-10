import { describe, expect, it } from "vitest";
import { GmailOAuthStateService } from "../src/channels/email/gmail-oauth-state-service";
import { FixtureGmailOAuthStateRepository } from "../src/channels/email/gmail-oauth-state-repository";
import { sha256Base64Url } from "../src/channels/email/gmail-pkce";

function createService(
  repository = new FixtureGmailOAuthStateRepository(),
  ttlMs = 5 * 60 * 1000,
) {
  return new GmailOAuthStateService(
    repository,
    {
      enabled: true,
      tokenVaultMode: "encrypted",
      oauthRedirectUri: "http://127.0.0.1:3000/internal/gmail/callback",
      oauthAllowedRedirectUris: [
        "http://127.0.0.1:3000/internal/gmail/callback",
      ],
      tokenEncryptionKeyBase64: Buffer.alloc(32, 4).toString("base64"),
      tokenEncryptionKeyVersion: "v1",
    },
    {
      nodeEnv: "test",
      defaultTtlMs: ttlMs,
    },
  );
}

describe("GmailOAuthStateService", () => {
  it("creates a connect intent with hashed state and S256 pkce", async () => {
    const repository = new FixtureGmailOAuthStateRepository();
    const service = createService(repository);
    const intent = await service.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      redirectUri: "http://127.0.0.1:3000/internal/gmail/callback",
      scopes: ["gmail.send", "gmail.readonly"],
      metadata: {
        connectionOrigin: "manual",
        // @ts-expect-error runtime sanitization
        accessToken: "must-not-survive",
      },
      now: new Date("2026-07-10T12:00:00.000Z"),
    });

    expect(intent.provider).toBe("gmail");
    expect(intent.codeChallengeMethod).toBe("S256");
    expect(intent.state.length).toBeGreaterThan(20);
    expect(intent.scopes).toEqual(["gmail.readonly", "gmail.send"]);

    const stored = await repository.findByStateHashScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      sha256Base64Url(intent.state),
    );

    expect(stored).not.toBeNull();
    expect(stored?.stateHash).not.toBe(intent.state);
    expect(JSON.stringify(stored)).not.toContain(intent.state);
    expect(JSON.stringify(stored)).not.toContain("must-not-survive");
  });

  it("consumes a valid state exactly once and returns the decrypted pkce verifier", async () => {
    const service = createService();
    const intent = await service.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_owner",
      actorRole: "owner",
      redirectUri: "http://127.0.0.1:3000/internal/gmail/callback",
      scopes: ["gmail.readonly"],
      now: new Date("2026-07-10T12:00:00.000Z"),
    });

    const consumed = await service.consumeConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      state: intent.state,
      now: new Date("2026-07-10T12:01:00.000Z"),
    });

    expect(consumed.entry.status).toBe("consumed");
    expect(consumed.pkceCodeVerifier.length).toBeGreaterThan(40);

    await expect(
      service.consumeConnectIntent({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        state: intent.state,
        now: new Date("2026-07-10T12:02:00.000Z"),
      }),
    ).rejects.toThrow("already been consumed");
  });

  it("rejects an expired state", async () => {
    const service = createService(new FixtureGmailOAuthStateRepository(), 1000);
    const intent = await service.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      redirectUri: "http://127.0.0.1:3000/internal/gmail/callback",
      scopes: ["gmail.readonly"],
      now: new Date("2026-07-10T12:00:00.000Z"),
    });

    await expect(
      service.consumeConnectIntent({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        state: intent.state,
        now: new Date("2026-07-10T12:00:02.000Z"),
      }),
    ).rejects.toThrow("has expired");
  });

  it("rejects cross-workspace consume and unsafe redirect URIs", async () => {
    const service = createService();
    const intent = await service.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      redirectUri: "http://127.0.0.1:3000/internal/gmail/callback",
      scopes: ["gmail.readonly"],
      now: new Date("2026-07-10T12:00:00.000Z"),
    });

    await expect(
      service.consumeConnectIntent({
        organizationId: "org_other",
        workspaceId: "wks_other",
        state: intent.state,
        now: new Date("2026-07-10T12:00:30.000Z"),
      }),
    ).rejects.toThrow("Gmail OAuth state not found.");

    await expect(
      service.createConnectIntent({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        actorUserId: "usr_demo_agent",
        actorRole: "agent",
        redirectUri: "https://evil.example.test/callback",
        scopes: ["gmail.readonly"],
      }),
    ).rejects.toThrow("redirect URI is not allowed");
  });

  it("rejects viewer role and does not make a network call", async () => {
    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    globalThis.fetch = (async () => {
      fetchCalls += 1;
      throw new Error("network should not be called");
    }) as typeof globalThis.fetch;

    try {
      const service = createService();

      await expect(
        service.createConnectIntent({
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          actorUserId: "usr_demo_viewer",
          actorRole: "viewer",
          redirectUri: "http://127.0.0.1:3000/internal/gmail/callback",
          scopes: ["gmail.readonly"],
        }),
      ).rejects.toThrow("do not have permission");

      expect(fetchCalls).toBe(0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
