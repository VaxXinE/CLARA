import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import { DrizzleGmailInboundSyncStateRepository } from "../src/channels/email/gmail-inbound-sync-state-db-repository";
import { buildGmailInboundSyncState } from "../src/channels/email/gmail-inbound-sync-state-types";

type QueryRow = {
  id: string;
  organizationId: string;
  workspaceId: string;
  providerAccountId: string;
  provider: string;
  lastHistoryId: string | null;
  lastPageToken: string | null;
  lastSyncStatus: string;
  lastStartedAt: Date | null;
  lastCompletedAt: Date | null;
  lastFailedAt: Date | null;
  lastFailureReasonCode: string | null;
  lastFetchedCount: number;
  lastNormalizedCount: number;
  lastPersistedCount: number;
  lastMaterializedCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type Recorder = {
  inserts: unknown[];
  updates: unknown[];
};

function buildRow(overrides: Partial<QueryRow> = {}): QueryRow {
  return {
    id: "gmail_sync_state_demo",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    providerAccountId: "gmail_account_demo",
    provider: "gmail",
    lastHistoryId: "h123",
    lastPageToken: null,
    lastSyncStatus: "completed",
    lastStartedAt: new Date("2026-07-11T10:00:00.000Z"),
    lastCompletedAt: new Date("2026-07-11T10:01:00.000Z"),
    lastFailedAt: null,
    lastFailureReasonCode: null,
    lastFetchedCount: 2,
    lastNormalizedCount: 2,
    lastPersistedCount: 1,
    lastMaterializedCount: 1,
    createdAt: new Date("2026-07-11T10:00:00.000Z"),
    updatedAt: new Date("2026-07-11T10:01:00.000Z"),
    ...overrides,
  };
}

function createFakeDatabase(options: {
  findFirstResults?: Array<QueryRow | null>;
  recorder?: Recorder;
}): Database {
  const recorder =
    options.recorder ??
    ({
      inserts: [],
      updates: [],
    } satisfies Recorder);

  let findFirstCall = 0;
  const findFirst = vi.fn(async () => {
    const result = options.findFirstResults?.[findFirstCall] ?? null;
    findFirstCall += 1;
    return result;
  });

  const insert = vi.fn(() => ({
    values: vi.fn(async (values: unknown) => {
      recorder.inserts.push(values);
    }),
  }));

  const updateWhere = vi.fn(async () => undefined);
  const updateSet = vi.fn((values: unknown) => {
    recorder.updates.push(values);
    return {
      where: updateWhere,
    };
  });
  const update = vi.fn(() => ({
    set: updateSet,
  }));

  return {
    query: {
      gmailInboundSyncStates: {
        findFirst,
      },
    },
    insert,
    update,
  } as unknown as Database;
}

describe("DrizzleGmailInboundSyncStateRepository", () => {
  it("creates a scoped sync state row", async () => {
    const recorder: Recorder = {
      inserts: [],
      updates: [],
    };
    const repository = new DrizzleGmailInboundSyncStateRepository(
      createFakeDatabase({ recorder }),
    );

    const state = buildGmailInboundSyncState({
      id: "gmail_sync_state_demo",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      lastSyncStatus: "idle",
      createdAt: new Date("2026-07-11T10:00:00.000Z"),
    });

    const created = await repository.createState(state);

    expect(created.providerAccountId).toBe("gmail_account_demo");
    expect(recorder.inserts[0]).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      provider: "gmail",
    });
  });

  it("returns a scoped row by provider account", async () => {
    const repository = new DrizzleGmailInboundSyncStateRepository(
      createFakeDatabase({
        findFirstResults: [buildRow()],
      }),
    );

    const state = await repository.findByProviderAccountScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "gmail_account_demo",
    );

    expect(state).toMatchObject({
      providerAccountId: "gmail_account_demo",
      lastSyncStatus: "completed",
      lastHistoryId: "h123",
    });
  });

  it("updates sync status within workspace scope", async () => {
    const recorder: Recorder = {
      inserts: [],
      updates: [],
    };
    const repository = new DrizzleGmailInboundSyncStateRepository(
      createFakeDatabase({
        findFirstResults: [
          buildRow(),
          buildRow({
            lastSyncStatus: "partial",
            lastFailureReasonCode: "message_fetch_failed",
            updatedAt: new Date("2026-07-11T10:02:00.000Z"),
          }),
        ],
        recorder,
      }),
    );

    const updated = await repository.updateState({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      providerAccountId: "gmail_account_demo",
      lastSyncStatus: "partial",
      lastFailureReasonCode: "message_fetch_failed",
      updatedAt: new Date("2026-07-11T10:02:00.000Z"),
    });

    expect(updated?.lastSyncStatus).toBe("partial");
    expect(recorder.updates[0]).toMatchObject({
      lastSyncStatus: "partial",
      lastFailureReasonCode: "message_fetch_failed",
    });
  });
});
