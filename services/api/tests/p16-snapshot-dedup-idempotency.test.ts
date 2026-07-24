import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureExtensionSnapshotRepository } from "../src/extension/extension-snapshot-repository";

const auth = buildAuthContext({
  userId: "usr_p16_agent",
  organizationId: "org_p16",
  workspaceId: "wks_p16",
  role: "agent",
});

const snapshot = {
  provider: "extension" as const,
  officialApi: false as const,
  channel: "whatsapp" as const,
  capturedAt: new Date("2026-07-24T00:00:00.000Z"),
  snapshotHash: "snapshot_hash_idempotent",
  chatTitle: "Lead",
  chatSubtitle: null,
  sourceUrlOrigin: null,
  messages: [
    {
      id: "visible-1",
      direction: "incoming" as const,
      author: "Lead",
      text: "hello",
      timestampLabel: null,
      replyContextText: null,
    },
  ],
};

describe("P16 snapshot dedup idempotency", () => {
  it("deduplicates repeated snapshots only inside the same workspace scope", async () => {
    const repository = new FixtureExtensionSnapshotRepository();
    const baseInput = {
      auth,
      scope: {
        organizationId: auth.organizationId,
        workspaceId: auth.workspaceId,
      },
      snapshot,
      correlationId: "corr_p16",
    };

    const first = await repository.persistSnapshot(baseInput);
    const duplicate = await repository.persistSnapshot(baseInput);
    const otherWorkspace = await repository.persistSnapshot({
      ...baseInput,
      scope: {
        organizationId: auth.organizationId,
        workspaceId: "wks_p16_other",
      },
    });

    expect(first.status).toBe("accepted");
    expect(duplicate.status).toBe("duplicate");
    expect(duplicate.persistedMessageCount).toBe(0);
    expect(otherWorkspace.status).toBe("accepted");
    expect(otherWorkspace.conversationId).not.toBe(first.conversationId);
    expect(repository.getSnapshotCount()).toBe(2);
  });
});
