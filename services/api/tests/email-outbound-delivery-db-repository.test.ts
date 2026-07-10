import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import { DrizzleEmailOutboundDeliveryRepository } from "../src/channels/email/email-outbound-delivery-db-repository";

type Recorder = {
  inserts: Array<{ table: unknown; values: unknown }>;
};

function createFakeDatabase(options: {
  selectResults: unknown[][];
  recorder?: Recorder;
}): Database {
  const recorder =
    options.recorder ??
    ({
      inserts: [],
    } satisfies Recorder);

  let selectCall = 0;
  const limit = vi.fn(async () => {
    const result = options.selectResults[selectCall] ?? [];
    selectCall += 1;
    return result;
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

  const tx = {
    select,
    insert,
  };

  return {
    transaction: vi.fn(async (callback) => callback(tx)),
  } as unknown as Database;
}

describe("DrizzleEmailOutboundDeliveryRepository", () => {
  it("inserts a new scoped outbound delivery record", async () => {
    const recorder: Recorder = {
      inserts: [],
    };
    const repository = new DrizzleEmailOutboundDeliveryRepository(
      createFakeDatabase({
        selectResults: [[], []],
        recorder,
      }),
    );

    const result = await repository.recordDelivery({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      replyId: "msg_demo_budi_2",
      actorUserId: "usr_demo_agent",
      provider: "simulated-email",
      providerMessageId: "provider_msg_db_001",
      providerThreadId: "provider_thread_db_001",
      idempotencyKey: "idem_db_001",
      status: "simulated",
      sentAt: new Date("2026-07-10T10:00:00.000Z"),
      metadata: {
        source: "email_reply_adapter",
        transport: "simulated",
      },
    });

    expect(result.alreadyRecorded).toBe(false);
    expect(recorder.inserts).toHaveLength(1);
    expect(recorder.inserts[0]?.values).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      replyId: "msg_demo_budi_2",
      actorUserId: "usr_demo_agent",
      channel: "email",
      provider: "simulated-email",
      providerMessageId: "provider_msg_db_001",
      providerThreadId: "provider_thread_db_001",
      idempotencyKey: "idem_db_001",
      status: "simulated",
    });
  });

  it("returns an existing scoped record when the idempotency key already exists", async () => {
    const repository = new DrizzleEmailOutboundDeliveryRepository(
      createFakeDatabase({
        selectResults: [
          [
            {
              id: "email_outbound_existing",
              organizationId: "org_demo",
              workspaceId: "wks_demo_sales",
              conversationId: "conv_demo_budi_stock",
              customerId: "cust_demo_budi",
              replyId: "msg_demo_budi_2",
              actorUserId: "usr_demo_agent",
              channel: "email",
              provider: "simulated-email",
              providerMessageId: "provider_msg_existing",
              providerThreadId: "provider_thread_existing",
              idempotencyKey: "idem_existing",
              status: "simulated",
              failureCode: null,
              metadata: {
                source: "email_reply_adapter",
                transport: "simulated",
              },
              sentAt: new Date("2026-07-10T10:05:00.000Z"),
              failedAt: null,
              createdAt: new Date("2026-07-10T10:05:00.000Z"),
            },
          ],
        ],
      }),
    );

    const result = await repository.recordDelivery({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      actorUserId: "usr_demo_agent",
      provider: "simulated-email",
      providerMessageId: "provider_msg_existing",
      idempotencyKey: "idem_existing",
      status: "simulated",
      sentAt: new Date("2026-07-10T10:05:00.000Z"),
      metadata: {
        source: "email_reply_adapter",
        transport: "simulated",
      },
    });

    expect(result.alreadyRecorded).toBe(true);
    expect(result.id).toBe("email_outbound_existing");
  });

  it("returns an existing scoped record when the provider message already exists", async () => {
    const repository = new DrizzleEmailOutboundDeliveryRepository(
      createFakeDatabase({
        selectResults: [
          [
            {
              id: "email_outbound_existing_provider",
              organizationId: "org_demo",
              workspaceId: "wks_demo_sales",
              conversationId: "conv_demo_budi_stock",
              customerId: "cust_demo_budi",
              replyId: null,
              actorUserId: "usr_demo_agent",
              channel: "email",
              provider: "simulated-email",
              providerMessageId: "provider_msg_duplicate",
              providerThreadId: null,
              idempotencyKey: null,
              status: "sent",
              failureCode: null,
              metadata: {
                source: "email_reply_adapter",
              },
              sentAt: new Date("2026-07-10T10:10:00.000Z"),
              failedAt: null,
              createdAt: new Date("2026-07-10T10:10:00.000Z"),
            },
          ],
        ],
      }),
    );

    const result = await repository.recordDelivery({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      actorUserId: "usr_demo_agent",
      provider: "simulated-email",
      providerMessageId: "provider_msg_duplicate",
      status: "sent",
      sentAt: new Date("2026-07-10T10:10:00.000Z"),
      metadata: {
        source: "email_reply_adapter",
      },
    });

    expect(result.alreadyRecorded).toBe(true);
    expect(result.id).toBe("email_outbound_existing_provider");
  });
});
