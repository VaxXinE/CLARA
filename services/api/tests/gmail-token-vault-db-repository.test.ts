import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import { DrizzleGmailTokenVaultRepository } from "../src/channels/email/gmail-token-vault-db-repository";

type QueryRow = {
  id: string;
  organizationId: string;
  workspaceId: string;
  providerAccountId: string | null;
  provider: string;
  tokenPurpose: string;
  ciphertext: string;
  iv: string;
  authTag: string;
  keyVersion: string;
  expiresAt: Date | null;
  revokedAt: Date | null;
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
      gmailTokenVaultEntries: {
        findFirst,
      },
    },
    insert,
    update,
  } as unknown as Database;
}

function buildRow(overrides: Partial<QueryRow> = {}): QueryRow {
  return {
    id: "gmail_token_ref_demo_001",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    providerAccountId: "gmail_account_demo_001",
    provider: "gmail",
    tokenPurpose: "oauth_grant",
    ciphertext: "ciphertext-demo",
    iv: "iv-demo",
    authTag: "tag-demo",
    keyVersion: "v1",
    expiresAt: new Date("2026-07-10T12:30:00.000Z"),
    revokedAt: null,
    metadata: {
      scopes: ["gmail.readonly", "gmail.send"],
      ignored: "nope",
    },
    createdAt: new Date("2026-07-10T12:00:00.000Z"),
    updatedAt: new Date("2026-07-10T12:00:00.000Z"),
    ...overrides,
  };
}

describe("DrizzleGmailTokenVaultRepository", () => {
  it("creates an encrypted scoped token vault entry without plaintext token fields", async () => {
    const recorder: Recorder = {
      inserts: [],
      updates: [],
    };
    const repository = new DrizzleGmailTokenVaultRepository(
      createFakeDatabase({
        recorder,
      }),
    );

    await repository.createEntry({
      id: "gmail_token_ref_demo_001",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo_001",
      provider: "gmail",
      tokenPurpose: "oauth_grant",
      ciphertext: "ciphertext-demo",
      iv: "iv-demo",
      authTag: "tag-demo",
      keyVersion: "v1",
      expiresAt: new Date("2026-07-10T12:30:00.000Z"),
      revokedAt: null,
      metadata: {
        scopes: ["gmail.send", "gmail.readonly", "gmail.send"],
      },
      createdAt: new Date("2026-07-10T12:00:00.000Z"),
      updatedAt: new Date("2026-07-10T12:00:00.000Z"),
    });

    expect(recorder.inserts).toHaveLength(1);
    expect(recorder.inserts[0]).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo_001",
      provider: "gmail",
      tokenPurpose: "oauth_grant",
      ciphertext: "ciphertext-demo",
      authTag: "tag-demo",
      keyVersion: "v1",
      metadata: {
        scopes: ["gmail.readonly", "gmail.send"],
      },
    });
    expect(JSON.stringify(recorder.inserts[0])).not.toContain("accessToken");
    expect(JSON.stringify(recorder.inserts[0])).not.toContain("refreshToken");
  });

  it("reads a token vault entry only inside the same workspace scope", async () => {
    const repository = new DrizzleGmailTokenVaultRepository(
      createFakeDatabase({
        findFirstResults: [buildRow()],
      }),
    );

    const entry = await repository.findByReferenceScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "gmail_token_ref_demo_001",
    );

    expect(entry).toMatchObject({
      id: "gmail_token_ref_demo_001",
      keyVersion: "v1",
      metadata: {
        scopes: ["gmail.readonly", "gmail.send"],
      },
    });
    expect(entry?.metadata).not.toHaveProperty("ignored");
  });

  it("marks a token vault entry revoked inside scoped update", async () => {
    const recorder: Recorder = {
      inserts: [],
      updates: [],
    };
    const repository = new DrizzleGmailTokenVaultRepository(
      createFakeDatabase({
        findFirstResults: [
          buildRow(),
          buildRow({
            revokedAt: new Date("2026-07-10T13:00:00.000Z"),
            updatedAt: new Date("2026-07-10T13:00:00.000Z"),
          }),
        ],
        recorder,
      }),
    );

    const revoked = await repository.revokeEntry({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      referenceId: "gmail_token_ref_demo_001",
      revokedAt: new Date("2026-07-10T13:00:00.000Z"),
      updatedAt: new Date("2026-07-10T13:00:00.000Z"),
    });

    expect(recorder.updates).toHaveLength(1);
    expect(revoked?.revokedAt?.toISOString()).toBe("2026-07-10T13:00:00.000Z");
  });
});
