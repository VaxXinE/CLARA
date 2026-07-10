import { describe, expect, it } from "vitest";
import { MockGmailTokenVault } from "../src/channels/email/mock-gmail-token-vault";

describe("MockGmailTokenVault", () => {
  it("stores and retrieves a scoped Gmail token reference inside the vault boundary", async () => {
    const vault = new MockGmailTokenVault();

    const stored = await vault.storeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo_001",
      scopes: ["gmail.readonly", "gmail.send"],
      tokenGrant: {
        accessToken: "access-token-demo",
        refreshToken: "refresh-token-demo",
        expiresAt: new Date("2026-07-10T12:00:00.000Z"),
      },
    });

    const tokenReference = await vault.getTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      referenceId: stored.referenceId,
    });

    expect(tokenReference).toMatchObject({
      referenceId: stored.referenceId,
      provider: "gmail",
      accountId: "gmail_account_demo_001",
      scopes: ["gmail.readonly", "gmail.send"],
      accessToken: "access-token-demo",
      refreshToken: "refresh-token-demo",
    });
  });

  it("fails closed across workspace scope", async () => {
    const vault = new MockGmailTokenVault();
    const stored = await vault.storeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo_002",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "scoped-access-token",
        refreshToken: "scoped-refresh-token",
        expiresAt: null,
      },
    });

    const tokenReference = await vault.getTokenReference({
      organizationId: "org_demo_other",
      workspaceId: "wks_demo_other",
      referenceId: stored.referenceId,
    });

    expect(tokenReference).toBeNull();
  });

  it("blocks the mock token vault in production mode", () => {
    expect(
      () =>
        new MockGmailTokenVault({
          config: {
            enabled: true,
            tokenVaultMode: "mock",
          },
          nodeEnv: "production",
        }),
    ).toThrow("mock Gmail token vault is not allowed in production");
  });
});
