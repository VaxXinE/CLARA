import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { ChannelAccountService } from "../src/channels/channel-account-service";
import { FixtureChannelAccountRepository } from "../src/channels/channel-account-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_viewer",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "viewer",
});

describe("ChannelAccountService", () => {
  it("allows viewer read access and strips unsafe metadata", async () => {
    const store = createFixtureAppStore();
    const service = new ChannelAccountService(
      new FixtureChannelAccountRepository(store),
    );

    await service.createAccount({
      id: "channel_account_unsafe_metadata",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      provider: "gmail",
      channelType: "email",
      displayName: "Unsafe Metadata Gmail",
      externalAccountId: "unsafe@example.test",
      status: "connected",
      healthStatus: "healthy",
      lastHealthCheckedAt: new Date("2026-07-12T00:00:00.000Z"),
      metadata: {
        source: "test",
        safe_note: "allowed",
        access_token: "atk",
        refresh_token: "rtk",
        Authorization: "Bearer atk",
        raw_gmail_payload: { unsafe: true },
      },
    });

    const result = await service.getAccount({
      auth,
      channelAccountId: "channel_account_unsafe_metadata",
    });
    const serialized = JSON.stringify(result);

    expect(result.data.account).toMatchObject({
      id: "channel_account_unsafe_metadata",
      provider: "gmail",
      metadata: {
        source: "test",
        safe_note: "allowed",
      },
    });
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw_gmail_payload");
  });

  it("returns safe not found for cross-workspace access", async () => {
    const service = new ChannelAccountService(
      new FixtureChannelAccountRepository(createFixtureAppStore()),
    );

    await expect(
      service.getAccount({
        auth,
        channelAccountId: "channel_account_other_gmail",
      }),
    ).rejects.toThrow("Channel account not found.");
  });
});
