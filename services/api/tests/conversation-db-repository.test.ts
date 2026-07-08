import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import { DrizzleConversationRepository } from "../src/conversations/conversation-db-repository";
import { createAppServiceContainer } from "../src/app/service-container";
import { loadEnv } from "../src/config/env";

type QueryResultStep = {
  result: unknown;
  terminal: "limit" | "orderBy";
};

type FakeQueryChain = {
  from: ReturnType<typeof vi.fn>;
  innerJoin: ReturnType<typeof vi.fn>;
  leftJoin: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
};

function createQueryChain(step: QueryResultStep) {
  const chain: FakeQueryChain = {
    from: vi.fn(() => chain),
    innerJoin: vi.fn(() => chain),
    leftJoin: vi.fn(() => chain),
    where: vi.fn(() => chain),
    orderBy:
      step.terminal === "orderBy"
        ? vi.fn(async () => step.result)
        : vi.fn(() => chain),
    limit:
      step.terminal === "limit"
        ? vi.fn(async () => step.result)
        : vi.fn(() => {
            throw new Error("limit() was not expected for this query step.");
          }),
  };

  return chain;
}

function createFakeDatabase(steps: QueryResultStep[]): Database {
  const queue = [...steps];

  return {
    select: vi.fn(() => {
      const step = queue.shift();

      if (!step) {
        throw new Error("Unexpected database select call.");
      }

      return createQueryChain(step);
    }),
  } as unknown as Database;
}

describe("DrizzleConversationRepository", () => {
  it("maps scoped conversation list rows and latest message snippets", async () => {
    const db = createFakeDatabase([
      {
        terminal: "limit",
        result: [
          {
            id: "conv_demo_sari_followup",
            source: "web_chat_demo",
            status: "pending",
            lastMessageAt: new Date("2026-07-07T09:35:00.000Z"),
            createdAt: new Date("2026-07-07T10:00:00.000Z"),
            updatedAt: new Date("2026-07-07T10:00:00.000Z"),
            customerId: "cust_demo_sari",
            customerDisplayName: "Sari Wijaya",
            customerSource: "web_chat_demo",
            customerStatus: "active",
            assignedUserId: "usr_demo_agent",
            assignedUserDisplayName: "Agent Demo",
          },
          {
            id: "conv_demo_budi_stock",
            source: "whatsapp_demo",
            status: "open",
            lastMessageAt: new Date("2026-07-07T09:05:00.000Z"),
            createdAt: new Date("2026-07-07T10:00:00.000Z"),
            updatedAt: new Date("2026-07-07T10:00:00.000Z"),
            customerId: "cust_demo_budi",
            customerDisplayName: "Budi Santoso",
            customerSource: "whatsapp_demo",
            customerStatus: "new",
            assignedUserId: "usr_demo_agent",
            assignedUserDisplayName: "Agent Demo",
          },
        ],
      },
      {
        terminal: "orderBy",
        result: [
          {
            conversationId: "conv_demo_sari_followup",
            body: "Pesanan Anda sedang kami cek.",
          },
          {
            conversationId: "conv_demo_budi_stock",
            body: "Kalau tersedia, saya ingin pesan hari ini.",
          },
        ],
      },
    ]);
    const repository = new DrizzleConversationRepository(db);

    const result = await repository.listScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      {
        limit: 1,
        search: "Sari",
      },
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      id: "conv_demo_sari_followup",
      snippet: "Pesanan Anda sedang kami cek.",
      customer: {
        id: "cust_demo_sari",
        displayName: "Sari Wijaya",
      },
      assignedUser: {
        id: "usr_demo_agent",
        displayName: "Agent Demo",
      },
    });
    expect(result.nextCursor).toEqual({
      sortTimestamp: "2026-07-07T09:35:00.000Z",
      conversationId: "conv_demo_sari_followup",
    });
  });

  it("returns scoped conversation detail with ordered messages", async () => {
    const db = createFakeDatabase([
      {
        terminal: "limit",
        result: [
          {
            id: "conv_demo_budi_stock",
            source: "whatsapp_demo",
            status: "open",
            lastMessageAt: new Date("2026-07-07T09:05:00.000Z"),
            createdAt: new Date("2026-07-07T10:00:00.000Z"),
            updatedAt: new Date("2026-07-07T10:00:00.000Z"),
            customerId: "cust_demo_budi",
            customerDisplayName: "Budi Santoso",
            customerSource: "whatsapp_demo",
            customerStatus: "new",
            assignedUserId: "usr_demo_agent",
            assignedUserDisplayName: "Agent Demo",
          },
        ],
      },
      {
        terminal: "orderBy",
        result: [
          {
            id: "msg_demo_budi_1",
            direction: "inbound",
            senderType: "customer",
            senderUserId: null,
            body: "Halo, apakah stok produk ini masih tersedia?",
            sentAt: new Date("2026-07-07T09:01:00.000Z"),
            deliveryStatus: "received",
            createdAt: new Date("2026-07-07T10:00:00.000Z"),
          },
          {
            id: "msg_demo_budi_2",
            direction: "outbound",
            senderType: "agent",
            senderUserId: "usr_demo_agent",
            body: "Halo Budi, kami bantu cek ya.",
            sentAt: new Date("2026-07-07T09:03:00.000Z"),
            deliveryStatus: "simulated",
            createdAt: new Date("2026-07-07T10:00:00.000Z"),
          },
        ],
      },
    ]);
    const repository = new DrizzleConversationRepository(db);

    const result = await repository.findByIdScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "conv_demo_budi_stock",
    );

    expect(result).toMatchObject({
      id: "conv_demo_budi_stock",
      customer: {
        id: "cust_demo_budi",
        displayName: "Budi Santoso",
      },
      assignedUser: {
        id: "usr_demo_agent",
        displayName: "Agent Demo",
      },
    });
    expect(result?.messages).toHaveLength(2);
    expect(result?.messages[0]).toMatchObject({
      id: "msg_demo_budi_1",
      direction: "inbound",
    });
  });

  it("returns null when the scoped conversation is not found", async () => {
    const db = createFakeDatabase([
      {
        terminal: "limit",
        result: [],
      },
    ]);
    const repository = new DrizzleConversationRepository(db);

    const result = await repository.findByIdScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "conv_missing_01",
    );

    expect(result).toBeNull();
  });
});

describe("app service container repository selection", () => {
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
      "DATABASE_URL is required in production so conversation and related APIs do not fall back to fixture data.",
    );
  });
});
