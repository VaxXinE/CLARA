import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { ExtensionSnapshotPersistenceService } from "../src/extension/extension-snapshot-persistence-service";
import { FixtureExtensionSnapshotRepository } from "../src/extension/extension-snapshot-repository";

const auth = buildAuthContext({
  userId: "usr_p16_agent",
  organizationId: "org_p16",
  workspaceId: "wks_p16",
  role: "agent",
});

describe("P16 safe snapshot ingestion", () => {
  it("returns safe ingestion summary without raw message content", async () => {
    const service = new ExtensionSnapshotPersistenceService(
      new FixtureExtensionSnapshotRepository(),
    );

    const result = await service.persist({
      auth,
      correlationId: "corr_p16",
      snapshot: {
        provider: "extension",
        officialApi: false,
        channel: "instagram",
        capturedAt: new Date("2026-07-24T00:00:00.000Z"),
        snapshotHash: "snapshot_hash_safe_ingestion",
        chatTitle: "Lead",
        chatSubtitle: null,
        sourceUrlOrigin: null,
        messages: [
          {
            id: "m1",
            direction: "incoming",
            author: "Lead",
            text: "private customer message",
            timestampLabel: null,
            replyContextText: null,
          },
        ],
      },
    });
    const serialized = JSON.stringify(result);

    expect(result.data.snapshot.status).toBe("accepted");
    expect(result.data.snapshot.message_count).toBe(1);
    expect(serialized).not.toContain("private customer message");
  });
});
