import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { ChannelAccountService } from "../src/channels/channel-account-service";
import { FixtureChannelAccountRepository } from "../src/channels/channel-account-repository";
import { ChannelHealthService } from "../src/channels/channel-health-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_owner",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "owner",
});

describe("P6 channel health service", () => {
  it("returns workspace-scoped channel health without secrets", async () => {
    const service = new ChannelHealthService(
      new ChannelAccountService(
        new FixtureChannelAccountRepository(createFixtureAppStore()),
      ),
    );

    const response = await service.listHealth({ auth });
    const serialized = JSON.stringify(response);

    expect(response.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          provider: "gmail",
          status: "connected",
          workspaceId: "wks_demo_sales",
          safeReasonCode: "connected",
        }),
        expect.objectContaining({
          provider: "instagram",
          status: "unsupported",
          safeReasonCode: "official_api_required",
        }),
      ]),
    );
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw_provider_payload");
    expect(serialized).not.toContain("client_secret");
  });

  it("does not trust client supplied organization or workspace values", async () => {
    const service = new ChannelHealthService(
      new ChannelAccountService(
        new FixtureChannelAccountRepository(createFixtureAppStore()),
      ),
    );

    const response = await service.listHealth({
      auth: {
        ...auth,
        organizationId: "org_other",
        workspaceId: "wks_other",
      },
    });

    expect(
      response.data.items.every((item) => item.workspaceId === "wks_other"),
    ).toBe(true);
    expect(response.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          provider: "gmail",
          accountId: null,
        }),
      ]),
    );
  });
});
