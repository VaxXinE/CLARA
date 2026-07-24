import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureExtensionSnapshotRepository } from "../src/extension/extension-snapshot-repository";

const auth = buildAuthContext({
  userId: "usr_p16_agent",
  organizationId: "org_p16",
  workspaceId: "wks_p16",
  role: "agent",
});

function snapshot(snapshotHash: string, messageId: string) {
  return {
    provider: "extension" as const,
    officialApi: false as const,
    channel: "instagram" as const,
    capturedAt: new Date("2026-07-24T00:00:00.000Z"),
    snapshotHash,
    chatTitle: "Same Lead",
    chatSubtitle: "same visible chat",
    sourceUrlOrigin: null,
    messages: [
      {
        id: messageId,
        direction: "incoming" as const,
        author: "Lead",
        text: "visible text",
        timestampLabel: null,
        replyContextText: null,
      },
    ],
  };
}

describe("P16 conversation linking policy", () => {
  it("links snapshots to conversations by workspace-scoped fingerprint", async () => {
    const repository = new FixtureExtensionSnapshotRepository();
    const scope = {
      organizationId: auth.organizationId,
      workspaceId: auth.workspaceId,
    };

    const first = await repository.persistSnapshot({
      auth,
      scope,
      snapshot: snapshot("snapshot_hash_link_1", "m1"),
      correlationId: "corr_1",
    });
    const second = await repository.persistSnapshot({
      auth,
      scope,
      snapshot: snapshot("snapshot_hash_link_2", "m2"),
      correlationId: "corr_2",
    });

    expect(second.status).toBe("accepted");
    expect(second.conversationFingerprint).toBe(first.conversationFingerprint);
    expect(second.conversationId).toBe(first.conversationId);
  });
});
