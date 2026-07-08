import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import { loadEnv } from "../src/config/env";
import { createAppServiceContainer } from "../src/app/service-container";
import { DrizzleActivityRepository } from "../src/activity/activity-db-repository";

function createFakeDatabase(rows: unknown[]): Database {
  const orderBy = vi.fn(async () => rows);
  const where = vi.fn(() => ({
    orderBy,
  }));
  const leftJoin = vi.fn(() => ({
    where,
  }));
  const from = vi.fn(() => ({
    leftJoin,
  }));
  const select = vi.fn(() => ({
    from,
  }));

  return {
    select,
  } as unknown as Database;
}

describe("DrizzleActivityRepository", () => {
  it("maps scoped activity rows in descending created order", async () => {
    const repository = new DrizzleActivityRepository(
      createFakeDatabase([
        {
          id: "act_demo_budi_ai_generated",
          conversationId: "conv_demo_budi_stock",
          eventType: "ai_draft_generated",
          summary: "AI draft generated for Budi stock conversation.",
          actorUserId: "usr_demo_agent",
          actorDisplayName: "Agent Demo",
          createdAt: new Date("2026-07-07T09:06:00.000Z"),
        },
        {
          id: "act_demo_budi_status_changed",
          conversationId: "conv_demo_budi_stock",
          eventType: "conversation_status_changed",
          summary: "Conversation status updated to open.",
          actorUserId: null,
          actorDisplayName: null,
          createdAt: new Date("2026-07-07T09:04:00.000Z"),
        },
      ]),
    );

    const result = await repository.listByConversationScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "conv_demo_budi_stock",
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: "act_demo_budi_ai_generated",
      conversationId: "conv_demo_budi_stock",
      eventType: "ai_draft_generated",
      actorUserId: "usr_demo_agent",
      actorDisplayName: "Agent Demo",
    });
    expect(result[1]).toMatchObject({
      id: "act_demo_budi_status_changed",
      eventType: "conversation_status_changed",
      actorUserId: null,
      actorDisplayName: null,
    });
  });

  it("returns an empty array when no scoped activity exists", async () => {
    const repository = new DrizzleActivityRepository(createFakeDatabase([]));

    const result = await repository.listByConversationScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "conv_missing_01",
    );

    expect(result).toEqual([]);
  });
});

describe("app service container activity repository selection", () => {
  it("blocks fixture fallback in production when DATABASE_URL is missing", () => {
    const env = loadEnv({
      NODE_ENV: "production",
      APP_NAME: "clara-api",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "info",
      AUTH_MODE: "provider",
      AUTH_PROVIDER: "supabase",
      MOCK_AUTH_ENABLED: "false",
      SUPABASE_AUTH_JWKS_URL: "https://example.supabase.test/auth/v1/jwks",
      SUPABASE_AUTH_ISSUER: "https://example.supabase.test/auth/v1",
      CORS_ORIGIN: "",
    });

    expect(() => createAppServiceContainer(env)).toThrow(
      "DATABASE_URL is required in production so conversation, customer, activity, and related APIs do not fall back to fixture data.",
    );
  });
});
