import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import { DrizzleGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-db-repository";

type QueryRow = {
  id: string;
  organizationId: string;
  workspaceId: string;
  provider: string;
  emailAddress: string;
  displayName: string | null;
  status: string;
  scopes: unknown;
  tokenReferenceId: string | null;
  lastVerifiedAt: Date | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type Recorder = {
  inserts: unknown[];
  updates: unknown[];
};

function createFakeDatabase(options: {
  findFirstResults?: Array<QueryRow | null>;
  selectRows?: QueryRow[];
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

  const where = vi.fn(async () => options.selectRows ?? []);
  const from = vi.fn(() => ({
    where,
  }));
  const select = vi.fn(() => ({
    from,
  }));

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
      gmailProviderAccounts: {
        findFirst,
      },
    },
    select,
    insert,
    update,
  } as unknown as Database;
}

function buildRow(overrides: Partial<QueryRow> = {}): QueryRow {
  return {
    id: "gmail_account_demo_001",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    provider: "gmail",
    emailAddress: "agent.gmail@example.test",
    displayName: "Demo Agent Gmail",
    status: "connected",
    scopes: ["gmail.readonly", "gmail.send"],
    tokenReferenceId: "vault_ref_demo_001",
    lastVerifiedAt: new Date("2026-07-10T11:00:00.000Z"),
    metadata: {
      mailboxType: "google_workspace",
      connectionOrigin: "manual",
    },
    createdAt: new Date("2026-07-10T11:00:00.000Z"),
    updatedAt: new Date("2026-07-10T11:00:00.000Z"),
    ...overrides,
  };
}

describe("DrizzleGmailProviderAccountRepository", () => {
  it("creates a scoped Gmail provider account row", async () => {
    const recorder: Recorder = {
      inserts: [],
      updates: [],
    };
    const repository = new DrizzleGmailProviderAccountRepository(
      createFakeDatabase({
        findFirstResults: [null],
        recorder,
      }),
    );

    const created = await repository.createAccount({
      id: "gmail_account_demo_001",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      provider: "gmail",
      emailAddress: "agent.gmail@example.test",
      displayName: "Demo Agent Gmail",
      status: "connected",
      scopes: ["gmail.readonly", "gmail.send"],
      tokenReferenceId: "vault_ref_demo_001",
      lastVerifiedAt: new Date("2026-07-10T11:00:00.000Z"),
      createdAt: new Date("2026-07-10T11:00:00.000Z"),
      updatedAt: new Date("2026-07-10T11:00:00.000Z"),
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "manual",
      },
    });

    expect(created.emailAddress).toBe("agent.gmail@example.test");
    expect(recorder.inserts).toHaveLength(1);
    expect(recorder.inserts[0]).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      provider: "gmail",
      emailAddress: "agent.gmail@example.test",
      tokenReferenceId: "vault_ref_demo_001",
    });
  });

  it("returns a scoped account by workspace scope", async () => {
    const repository = new DrizzleGmailProviderAccountRepository(
      createFakeDatabase({
        findFirstResults: [buildRow()],
      }),
    );

    const account = await repository.findByIdScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "gmail_account_demo_001",
    );

    expect(account).toMatchObject({
      id: "gmail_account_demo_001",
      provider: "gmail",
      emailAddress: "agent.gmail@example.test",
      status: "connected",
    });
  });

  it("updates account status within workspace scope", async () => {
    const recorder: Recorder = {
      inserts: [],
      updates: [],
    };
    const repository = new DrizzleGmailProviderAccountRepository(
      createFakeDatabase({
        findFirstResults: [
          buildRow(),
          buildRow({
            status: "revoked",
            updatedAt: new Date("2026-07-10T12:00:00.000Z"),
          }),
        ],
        recorder,
      }),
    );

    const updated = await repository.updateAccount({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      accountId: "gmail_account_demo_001",
      status: "revoked",
      updatedAt: new Date("2026-07-10T12:00:00.000Z"),
    });

    expect(updated?.status).toBe("revoked");
    expect(recorder.updates).toHaveLength(1);
    expect(recorder.updates[0]).toMatchObject({
      status: "revoked",
    });
  });

  it("persists allowlisted metadata updates such as historyId", async () => {
    const recorder: Recorder = {
      inserts: [],
      updates: [],
    };
    const repository = new DrizzleGmailProviderAccountRepository(
      createFakeDatabase({
        findFirstResults: [
          buildRow(),
          buildRow({
            metadata: {
              mailboxType: "google_workspace",
              connectionOrigin: "manual",
              historyId: "h123",
            },
            updatedAt: new Date("2026-07-10T12:30:00.000Z"),
          }),
        ],
        recorder,
      }),
    );

    const updated = await repository.updateAccount({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      accountId: "gmail_account_demo_001",
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "manual",
        historyId: "h123",
        // @ts-expect-error runtime sanitization check
        rawBody: "drop-me",
      },
      updatedAt: new Date("2026-07-10T12:30:00.000Z"),
    });

    expect(updated?.metadata).toEqual({
      mailboxType: "google_workspace",
      connectionOrigin: "manual",
      historyId: "h123",
    });
    expect(recorder.updates[0]).toMatchObject({
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "manual",
        historyId: "h123",
      },
    });
  });

  it("keeps workspace isolation on list reads", async () => {
    const repository = new DrizzleGmailProviderAccountRepository(
      createFakeDatabase({
        selectRows: [
          buildRow(),
          buildRow({
            id: "gmail_account_demo_002",
            emailAddress: "owner.gmail@example.test",
          }),
        ],
      }),
    );

    const accounts = await repository.listAccountsScoped({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
    });

    expect(accounts).toHaveLength(2);
    expect(accounts.map((account) => account.workspaceId)).toEqual([
      "wks_demo_sales",
      "wks_demo_sales",
    ]);
  });

  it("rejects duplicate provider email within the same workspace scope", async () => {
    const repository = new DrizzleGmailProviderAccountRepository(
      createFakeDatabase({
        findFirstResults: [buildRow()],
      }),
    );

    await expect(
      repository.createAccount({
        id: "gmail_account_demo_003",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        provider: "gmail",
        emailAddress: "agent.gmail@example.test",
        displayName: "Another Agent",
        status: "connected",
        scopes: ["gmail.readonly"],
        tokenReferenceId: "vault_ref_demo_003",
        lastVerifiedAt: new Date("2026-07-10T11:30:00.000Z"),
        createdAt: new Date("2026-07-10T11:30:00.000Z"),
        updatedAt: new Date("2026-07-10T11:30:00.000Z"),
        metadata: {},
      }),
    ).rejects.toThrow(
      "Gmail provider account already exists for this workspace email.",
    );
  });
});
