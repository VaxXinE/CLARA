import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { ExtensionSnapshotPersistenceService } from "../src/extension/extension-snapshot-persistence-service";
import type { ExtensionSnapshotRepository } from "../src/extension/extension-snapshot-repository";
import type { PersistExtensionSnapshotInput } from "../src/extension/extension-snapshot-types";

function snapshot() {
  return {
    provider: "extension" as const,
    officialApi: false as const,
    channel: "whatsapp" as const,
    capturedAt: new Date("2026-07-24T00:00:00.000Z"),
    snapshotHash: "snapshot_hash_p16_scope",
    chatTitle: "Lead",
    chatSubtitle: null,
    sourceUrlOrigin: null,
    messages: [
      {
        id: "m1",
        direction: "incoming" as const,
        author: null,
        text: "Need help",
        timestampLabel: null,
        replyContextText: null,
      },
    ],
  };
}

describe("P16 workspace attribution policy", () => {
  it("binds snapshot persistence to AuthContext workspace membership", async () => {
    let captured: PersistExtensionSnapshotInput | undefined;
    const auth = buildAuthContext({
      userId: "usr_agent",
      organizationId: "org_from_auth",
      workspaceId: "wks_from_auth",
      role: "agent",
    });
    const repository: ExtensionSnapshotRepository = {
      persistSnapshot: async (input) => {
        captured = input;

        return {
          snapshotId: "snap_1",
          status: "accepted",
          duplicate: false,
          channel: input.snapshot.channel,
          snapshotHash: input.snapshot.snapshotHash,
          conversationFingerprint: "fp",
          conversationId: "conv_1",
          customerId: "cust_1",
          messageCount: 1,
          persistedMessageCount: 1,
          incomingCount: 1,
          outgoingCount: 0,
          capturedAt: input.snapshot.capturedAt,
        };
      },
    };

    await new ExtensionSnapshotPersistenceService(repository).persist({
      auth,
      snapshot: snapshot(),
      correlationId: "corr",
    });

    expect(captured?.scope).toEqual({
      organizationId: "org_from_auth",
      workspaceId: "wks_from_auth",
    });
    expect(captured?.auth.userId).toBe("usr_agent");
  });
});
