import { describe, expect, it } from "vitest";
import type { Database } from "../src/db/client";
import { FixtureGmailOAuthStateRepository } from "../src/channels/email/gmail-oauth-state-repository";
import { GmailOAuthStateService } from "../src/channels/email/gmail-oauth-state-service";
import { GmailOAuthConnectService } from "../src/channels/email/gmail-oauth-connect-service";
import { GmailOAuthCallbackService } from "../src/channels/email/gmail-oauth-callback-service";
import { GmailOAuthTokenExchangeService } from "../src/channels/email/gmail-oauth-token-exchange-service";
import { SimulatedGmailOAuthTokenExchangeClient } from "../src/channels/email/simulated-gmail-oauth-token-exchange-client";
import { EncryptedGmailTokenVaultService } from "../src/channels/email/gmail-token-vault-service";
import { DrizzleGmailTokenVaultRepository } from "../src/channels/email/gmail-token-vault-db-repository";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
import { buildAuthContext } from "../src/auth/auth-context";

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

function createServices() {
  const repository = new FixtureGmailOAuthStateRepository();
  const providerAccountRepository = new FixtureGmailProviderAccountRepository();
  const config = {
    enabled: true,
    tokenVaultMode: "encrypted" as const,
    oauthAuthorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    oauthTokenExchangeMode: "simulated" as const,
    oauthClientId: "gmail-client-id-placeholder",
    oauthRedirectUri:
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    oauthAllowedRedirectUris: [
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    ],
    oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
    tokenEncryptionKeyBase64: Buffer.alloc(32, 12).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
  };
  const stateService = new GmailOAuthStateService(repository, config, {
    nodeEnv: "test",
    defaultTtlMs: 5 * 60 * 1000,
  });
  const { db, rows } = createEncryptedVaultDatabase();
  const tokenVault = new EncryptedGmailTokenVaultService(
    new DrizzleGmailTokenVaultRepository(db),
    config,
    { nodeEnv: "test" },
  );
  const tokenExchangeService = new GmailOAuthTokenExchangeService(
    new SimulatedGmailOAuthTokenExchangeClient({
      nodeEnv: "test",
    }),
    tokenVault,
    providerAccountRepository,
  );

  return {
    rows,
    providerAccountRepository,
    connectService: new GmailOAuthConnectService(stateService, config, {
      nodeEnv: "test",
    }),
    callbackService: new GmailOAuthCallbackService(stateService, {
      tokenExchangeMode: "simulated",
      tokenExchangeService,
    }),
  };
}

describe("Gmail OAuth callback completion wiring", () => {
  it("completes a simulated connect flow end-to-end with safe persistence only", async () => {
    const { rows, providerAccountRepository, connectService, callbackService } =
      createServices();
    const auth = buildAuthContext({
      userId: "usr_demo_agent",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      role: "agent",
    });

    const connectResult = await connectService.createAuthorizationUrl({
      auth,
      redirectUri:
        "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
      scopes: ["gmail.readonly", "gmail.send"],
    });
    const state = new URL(connectResult.authorization_url).searchParams.get(
      "state",
    );

    const callbackResult = await callbackService.validateCallback({
      code: "example-complete-flow-code",
      ...(state ? { state } : {}),
    });

    expect(callbackResult).toMatchObject({
      provider: "gmail",
      status: "connected",
      account: {
        provider: "gmail",
        emailAddress: "simulated.gmail.account@example.test",
        scopes: ["gmail.readonly", "gmail.send"],
      },
    });
    expect(JSON.stringify(callbackResult)).not.toContain(
      "example-complete-flow-code",
    );
    expect(JSON.stringify(callbackResult)).not.toContain(state ?? "");
    expect(JSON.stringify(callbackResult)).not.toContain(
      "example-gmail-access-token",
    );
    expect(JSON.stringify(callbackResult)).not.toContain(
      "example-gmail-refresh-token",
    );

    expect(rows).toHaveLength(1);
    expect(JSON.stringify(rows[0])).not.toContain("example-complete-flow-code");
    expect(JSON.stringify(rows[0])).not.toContain("example-gmail-access-token");
    expect(JSON.stringify(rows[0])).not.toContain(
      "example-gmail-refresh-token",
    );

    const storedAccount = await providerAccountRepository.findByEmailScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "gmail",
      "simulated.gmail.account@example.test",
    );

    expect(storedAccount?.status).toBe("connected");
    expect(storedAccount?.tokenReferenceId).toBeTruthy();
  });
});
