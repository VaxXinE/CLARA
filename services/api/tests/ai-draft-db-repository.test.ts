import { describe, expect, it, vi } from "vitest";
import { NotFoundError } from "../src/errors/app-error";
import type { Database } from "../src/db/client";
import { DrizzleAiDraftRepository } from "../src/ai-drafts/ai-draft-db-repository";

type TransactionRecorder = {
  inserts: Array<{ table: unknown; values: unknown }>;
};

function createFakeDatabase(options: {
  conversationRows: unknown[];
  recorder?: TransactionRecorder;
}): Database {
  const recorder =
    options.recorder ??
    ({
      inserts: [],
    } satisfies TransactionRecorder);

  const limit = vi.fn(async () => options.conversationRows);
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

  const tx = {
    select,
    insert,
  };

  return {
    transaction: vi.fn(async (callback) => callback(tx)),
  } as unknown as Database;
}

describe("DrizzleAiDraftRepository", () => {
  it("persists scoped draft, AI event, and activity event", async () => {
    const recorder: TransactionRecorder = {
      inserts: [],
    };
    const repository = new DrizzleAiDraftRepository(
      createFakeDatabase({
        conversationRows: [{ id: "conv_demo_budi_stock" }],
        recorder,
      }),
    );

    const result = await repository.createDraftArtifacts({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      createdByUserId: "usr_demo_agent",
      draftBody: "Hi Budi, thanks for reaching out.",
      provider: "mock",
      model: "mock-clara-draft-v1",
      promptVersion: "mvp_reply_draft_v1",
      latencyMs: 42,
    });

    expect(result).toMatchObject({
      conversationId: "conv_demo_budi_stock",
      body: "Hi Budi, thanks for reaching out.",
      status: "draft",
      provider: "mock",
      model: "mock-clara-draft-v1",
    });
    expect(recorder.inserts).toHaveLength(3);
    expect(recorder.inserts[0]?.values).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      createdByUserId: "usr_demo_agent",
      draftBody: "Hi Budi, thanks for reaching out.",
      source: "ai",
      status: "draft",
    });
    expect(recorder.inserts[1]?.values).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      createdByUserId: "usr_demo_agent",
      provider: "mock",
      model: "mock-clara-draft-v1",
      promptVersion: "mvp_reply_draft_v1",
      status: "succeeded",
    });
    expect(recorder.inserts[2]?.values).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      actorUserId: "usr_demo_agent",
      eventType: "ai_draft_generated",
    });
  });

  it("fails closed when the scoped conversation is missing", async () => {
    const repository = new DrizzleAiDraftRepository(
      createFakeDatabase({
        conversationRows: [],
      }),
    );

    await expect(
      repository.createDraftArtifacts({
        scope: {
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
        },
        conversationId: "conv_missing_01",
        createdByUserId: "usr_demo_agent",
        draftBody: "Hello",
        provider: "mock",
        model: "mock-clara-draft-v1",
        promptVersion: "mvp_reply_draft_v1",
        latencyMs: null,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
