import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import { DrizzleEmailInboundRepository } from "../src/channels/email/email-inbound-db-repository";

type Recorder = {
  inserts: Array<{ table: unknown; values: unknown }>;
  updates: Array<{ table: unknown; values: unknown }>;
};

function createFakeDatabase(options: {
  selectResults: unknown[][];
  recorder?: Recorder;
}): Database {
  const recorder =
    options.recorder ??
    ({
      inserts: [],
      updates: [],
    } satisfies Recorder);

  let selectCall = 0;
  const limit = vi.fn(async () => {
    const result = options.selectResults[selectCall] ?? [];
    selectCall += 1;
    return result;
  });
  const orderBy = vi.fn(() => ({
    limit,
  }));
  const where = vi.fn(() => ({
    limit,
    orderBy,
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

describe("DrizzleEmailInboundRepository", () => {
  it("creates scoped customer, conversation, message, activity, and inbound record", async () => {
    const recorder: Recorder = {
      inserts: [],
      updates: [],
    };
    const repository = new DrizzleEmailInboundRepository(
      createFakeDatabase({
        selectResults: [[], [], []],
        recorder,
      }),
    );

    const result = await repository.persistInboundEmail({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      email: {
        provider: "simulated-email",
        providerMessageId: "email_msg_db_001",
        threadId: "email_thread_db_001",
        fromEmail: "db.customer@example.test",
        fromName: "DB Customer",
        toEmail: "support@example.test",
        subject: "Database persistence check",
        textBody: "Persist this once.",
        htmlBodyPresent: false,
        receivedAt: new Date("2026-07-09T11:00:00.000Z"),
        headers: {
          "message-id": "<email_msg_db_001@example.test>",
        },
        attachmentsPresent: false,
      },
    });

    expect(result.alreadyProcessed).toBe(false);
    expect(recorder.inserts).toHaveLength(5);
    expect(recorder.inserts[0]?.values).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      contactIdentifier: "db.customer@example.test",
      source: "email",
    });
    expect(recorder.inserts[1]?.values).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      customerId: result.customerId,
      source: "email",
    });
    expect(recorder.inserts[2]?.values).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: result.conversationId,
      direction: "inbound",
      senderType: "customer",
      body: "Persist this once.",
    });
    expect(recorder.inserts[3]?.values).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: result.conversationId,
      eventType: "email_received",
    });
    expect(recorder.inserts[4]?.values).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      provider: "simulated-email",
      providerMessageId: "email_msg_db_001",
      customerId: result.customerId,
      conversationId: result.conversationId,
      activityId: result.activityId,
    });
  });

  it("returns already_processed=true when the provider message id already exists in scope", async () => {
    const repository = new DrizzleEmailInboundRepository(
      createFakeDatabase({
        selectResults: [
          [
            {
              customerId: "cust_existing",
              conversationId: "conv_existing",
              activityId: "act_existing",
            },
          ],
        ],
      }),
    );

    const result = await repository.persistInboundEmail({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      email: {
        provider: "simulated-email",
        providerMessageId: "email_msg_existing",
        threadId: "thread_existing",
        fromEmail: "existing@example.test",
        fromName: "Existing",
        toEmail: "support@example.test",
        subject: "Existing",
        textBody: "Existing body",
        htmlBodyPresent: false,
        receivedAt: new Date("2026-07-09T12:00:00.000Z"),
        headers: {},
        attachmentsPresent: false,
      },
    });

    expect(result).toEqual({
      customerId: "cust_existing",
      conversationId: "conv_existing",
      activityId: "act_existing",
      alreadyProcessed: true,
    });
  });
});
