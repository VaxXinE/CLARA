import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureExtensionSnapshotRepository } from "../src/extension/extension-snapshot-repository";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

const snapshot = {
  provider: "extension" as const,
  officialApi: false as const,
  channel: "whatsapp" as const,
  capturedAt: new Date("2026-07-13T00:00:00.000Z"),
  snapshotHash: "snapshot_hash_abc",
  chatTitle: "Budi",
  chatSubtitle: null,
  sourceUrlOrigin: null,
  messages: [
    {
      id: "local-1",
      direction: "incoming" as const,
      author: "Budi",
      text: "Need help",
      timestampLabel: null,
      replyContextText: null,
    },
  ],
};

describe("ExtensionSnapshotRepository", () => {
  it("deduplicates snapshots by scoped hash and fingerprint", async () => {
    const repository = new FixtureExtensionSnapshotRepository();
    const input = {
      auth,
      scope: {
        organizationId: auth.organizationId,
        workspaceId: auth.workspaceId,
      },
      snapshot,
      correlationId: "corr_demo",
    };

    const first = await repository.persistSnapshot(input);
    const second = await repository.persistSnapshot(input);

    expect(first.status).toBe("accepted");
    expect(second.status).toBe("duplicate");
    expect(second.snapshotId).toBe(first.snapshotId);
    expect(second.persistedMessageCount).toBe(0);
    expect(repository.getSnapshotCount()).toBe(1);
  });
});
