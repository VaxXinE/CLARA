import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import { NotFoundError } from "../src/errors/app-error";
import { DrizzleReplyRepository } from "../src/replies/reply-db-repository";

type TransactionRecorder = {
  inserts: Array<{ table: unknown; values: unknown }>;
  updates: Array<{ table: unknown; values: unknown }>;
};

function createFakeDatabase(options: {
  conversationRows: unknown[];
  draftRows?: unknown[];
  userRows?: unknown[];
  recorder?: TransactionRecorder;
}): Database {
  const recorder =
    options.recorder ??
    ({
      inserts: [],
      updates: [],
    } satisfies TransactionRecorder);

  let selectCall = 0;
  const limit = vi.fn(async () => {
    selectCall += 1;

    if (selectCall === 1) {
      return options.conversationRows;
    }

    if (selectCall === 2) {
      return options.draftRows ?? [];
    }

    return options.userRows ?? [];
  });
  const where = vi.fn(() => ({
    limit,
  }));
  const from = vi.fn(() => ({
    where,
  }));
  const select = vi.fn(() => ({
    from,
  }));
  const insert = vi.fn((table: unknown) => ({
    values: vi.fn(async (values: unknown) => {
      recorder.inserts.push({ table, values });
    }),
  }));
  const update = vi.fn((table: unknown) => ({
    set: vi.fn((values: unknown) => ({
      where: vi.fn(async () => {
        recorder.updates.push({ table, values });
      }),
    })),
  }));

  const tx = {
    select,
    insert,
    update,
  };

  return {
    transaction: vi.fn(async (callback) => callback(tx)),
  } as unknown as Database;
}

describe("DrizzleReplyRepository", () => {
  it("persists scoped outbound reply and marks the draft as sent", async () => {
    const recorder: TransactionRecorder = {
      inserts: [],
      updates: [],
    };
    const repository = new DrizzleReplyRepository(
      createFakeDatabase({
        conversationRows: [{ id: "conv_demo_budi_stock" }],
        draftRows: [{ id: "draft_demo_budi_ai" }],
        userRows: [{ displayName: "Agent Demo" }],
        recorder,
      }),
    );

    const result = await repository.createReply({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      senderUserId: "usr_demo_agent",
      body: "Hi Budi, thanks for reaching out.",
      provider: "simulated",
      sendStatus: "sent",
      deliveryStatus: "simulated",
      draftId: "draft_demo_budi_ai",
    });

    expect(result).toMatchObject({
      conversationId: "conv_demo_budi_stock",
      body: "Hi Budi, thanks for reaching out.",
      senderUserId: "usr_demo_agent",
      senderName: "Agent Demo",
      provider: "simulated",
      status: "sent",
    });
    expect(recorder.updates).toHaveLength(2);
    expect(recorder.updates[0]?.values).toMatchObject({
      status: "sent",
    });
    expect(recorder.updates[1]?.values).toMatchObject({
      lastMessageAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(recorder.inserts).toHaveLength(2);
    expect(recorder.inserts[0]?.values).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      direction: "outbound",
      senderType: "agent",
      senderUserId: "usr_demo_agent",
      body: "Hi Budi, thanks for reaching out.",
      deliveryStatus: "simulated",
    });
    expect(recorder.inserts[1]?.values).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      actorUserId: "usr_demo_agent",
      eventType: "reply_sent",
    });
  });

  it("fails closed when the scoped conversation is missing", async () => {
    const repository = new DrizzleReplyRepository(
      createFakeDatabase({
        conversationRows: [],
      }),
    );

    await expect(
      repository.createReply({
        scope: {
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
        },
        conversationId: "conv_missing_01",
        senderUserId: "usr_demo_agent",
        body: "Hello",
        provider: "simulated",
        sendStatus: "sent",
        deliveryStatus: "simulated",
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("fails closed when the scoped draft is missing", async () => {
    const repository = new DrizzleReplyRepository(
      createFakeDatabase({
        conversationRows: [{ id: "conv_demo_budi_stock" }],
        draftRows: [],
      }),
    );

    await expect(
      repository.createReply({
        scope: {
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
        },
        conversationId: "conv_demo_budi_stock",
        senderUserId: "usr_demo_agent",
        body: "Hello",
        provider: "simulated",
        sendStatus: "sent",
        deliveryStatus: "simulated",
        draftId: "draft_missing_01",
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
