import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import { DrizzleGmailOAuthStateRepository } from "../src/channels/email/gmail-oauth-state-db-repository";

type QueryRow = {
  id: string;
  organizationId: string;
  workspaceId: string;
  actorUserId: string;
  provider: "gmail";
  stateHash: string;
  nonceHash: string | null;
  pkceVerifierCiphertext: string;
  pkceVerifierIv: string;
  pkceVerifierAuthTag: string;
  pkceKeyVersion: string;
  codeChallenge: string;
  codeChallengeMethod: "S256";
  redirectUri: string;
  scopes: string[];
  status: "pending" | "consumed" | "expired" | "revoked";
  expiresAt: Date;
  consumedAt: Date | null;
  revokedAt: Date | null;
  metadata: {
    connectionOrigin?: "manual" | "test";
    ignored?: string;
  };
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
      gmailOAuthStateEntries: {
        findFirst,
      },
    },
    insert,
    update,
  } as unknown as Database;
}

function buildRow(overrides: Partial<QueryRow> = {}): QueryRow {
  return {
    id: "gmail_oauth_state_demo_001",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    actorUserId: "usr_demo_agent",
    provider: "gmail",
    stateHash: "state_hash_demo",
    nonceHash: "nonce_hash_demo",
    pkceVerifierCiphertext: "ciphertext_demo",
    pkceVerifierIv: "iv_demo",
    pkceVerifierAuthTag: "tag_demo",
    pkceKeyVersion: "v1",
    codeChallenge: "challenge_demo",
    codeChallengeMethod: "S256",
    redirectUri: "http://127.0.0.1:3000/internal/gmail/callback",
    scopes: ["gmail.readonly", "gmail.send"],
    status: "pending",
    expiresAt: new Date("2026-07-10T12:30:00.000Z"),
    consumedAt: null,
    revokedAt: null,
    metadata: {
      connectionOrigin: "manual",
      ignored: "drop-me",
    },
    createdAt: new Date("2026-07-10T12:00:00.000Z"),
    updatedAt: new Date("2026-07-10T12:00:00.000Z"),
    ...overrides,
  };
}

describe("DrizzleGmailOAuthStateRepository", () => {
  it("creates a scoped oauth state row without raw state", async () => {
    const recorder: Recorder = { inserts: [], updates: [] };
    const repository = new DrizzleGmailOAuthStateRepository(
      createFakeDatabase({ recorder }),
    );

    await repository.createEntry(buildRow());

    expect(recorder.inserts).toHaveLength(1);
    expect(recorder.inserts[0]).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      stateHash: "state_hash_demo",
      codeChallengeMethod: "S256",
    });
    expect(JSON.stringify(recorder.inserts[0])).not.toContain("raw-state");
  });

  it("finds a scoped oauth state entry by state hash", async () => {
    const repository = new DrizzleGmailOAuthStateRepository(
      createFakeDatabase({
        findFirstResults: [buildRow()],
      }),
    );

    const entry = await repository.findByStateHashScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "state_hash_demo",
    );

    expect(entry).toMatchObject({
      id: "gmail_oauth_state_demo_001",
      status: "pending",
      metadata: {
        connectionOrigin: "manual",
      },
    });
    expect(entry?.metadata).not.toHaveProperty("ignored");
  });

  it("updates consumed status within scope", async () => {
    const recorder: Recorder = { inserts: [], updates: [] };
    const repository = new DrizzleGmailOAuthStateRepository(
      createFakeDatabase({
        findFirstResults: [
          buildRow(),
          buildRow({
            status: "consumed",
            consumedAt: new Date("2026-07-10T12:10:00.000Z"),
          }),
        ],
        recorder,
      }),
    );

    const updated = await repository.updateEntry({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      entryId: "gmail_oauth_state_demo_001",
      status: "consumed",
      consumedAt: new Date("2026-07-10T12:10:00.000Z"),
      updatedAt: new Date("2026-07-10T12:10:00.000Z"),
    });

    expect(recorder.updates).toHaveLength(1);
    expect(updated?.status).toBe("consumed");
  });
});
