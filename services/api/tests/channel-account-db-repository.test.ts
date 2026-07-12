import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import { DrizzleChannelAccountRepository } from "../src/channels/channel-account-db-repository";

function buildRow() {
  return {
    id: "channel_account_demo_gmail",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    provider: "gmail",
    channelType: "email",
    displayName: "Demo Gmail",
    externalAccountId: "demo@example.test",
    status: "connected",
    healthStatus: "healthy",
    lastHealthCheckedAt: new Date("2026-07-12T00:00:00.000Z"),
    metadata: {
      source: "db_test",
      access_token: "atk",
    },
    createdAt: new Date("2026-07-12T00:00:00.000Z"),
    updatedAt: new Date("2026-07-12T00:00:00.000Z"),
  };
}

function createFakeDatabase(row: ReturnType<typeof buildRow> | null): Database {
  return {
    query: {
      channelAccounts: {
        findFirst: vi.fn(async () => row),
        findMany: vi.fn(async () => (row ? [row] : [])),
      },
    },
  } as unknown as Database;
}

describe("DrizzleChannelAccountRepository", () => {
  it("reads channel accounts scoped by organization and workspace", async () => {
    const repository = new DrizzleChannelAccountRepository(
      createFakeDatabase(buildRow()),
    );

    const account = await repository.findByIdScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "channel_account_demo_gmail",
    );

    expect(account).toMatchObject({
      id: "channel_account_demo_gmail",
      provider: "gmail",
      channelType: "email",
      metadata: {
        source: "db_test",
      },
    });
    expect(JSON.stringify(account)).not.toContain("access_token");
  });

  it("returns null when a scoped channel account is missing", async () => {
    const repository = new DrizzleChannelAccountRepository(
      createFakeDatabase(null),
    );

    await expect(
      repository.findByIdScoped(
        {
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
        },
        "channel_account_missing",
      ),
    ).resolves.toBeNull();
  });
});
