import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { ExtensionSnapshotPersistenceService } from "../src/extension/extension-snapshot-persistence-service";
import { FixtureExtensionSnapshotRepository } from "../src/extension/extension-snapshot-repository";
import { parseExtensionSnapshotPayload } from "../src/extension/extension-snapshot-validation";

describe("P16 extension ingestion e2e smoke", () => {
  it("parses, sanitizes, persists, links, and deduplicates a local/dev-safe snapshot", async () => {
    const auth = buildAuthContext({
      userId: "usr_p16_agent",
      organizationId: "org_p16",
      workspaceId: "wks_p16",
      role: "agent",
    });
    const service = new ExtensionSnapshotPersistenceService(
      new FixtureExtensionSnapshotRepository(),
    );
    const snapshot = parseExtensionSnapshotPayload({
      channel: "whatsapp",
      body: {
        provider: "extension",
        official_api: false,
        channel: "whatsapp",
        captured_at: "2026-07-24T00:00:00.000Z",
        snapshot_hash: "snapshot_hash_e2e",
        chat_title: "Lead",
        messages: [
          {
            id: "m1",
            direction: "incoming",
            text: "Bearer atk visible issue",
          },
        ],
      },
    });

    const first = await service.persist({
      auth,
      snapshot,
      correlationId: "corr_1",
    });
    const second = await service.persist({
      auth,
      snapshot,
      correlationId: "corr_2",
    });
    const serialized = JSON.stringify({ first, second });

    expect(first.data.snapshot.status).toBe("accepted");
    expect(second.data.snapshot.status).toBe("duplicate");
    expect(first.data.snapshot.conversation_id).toBe(
      second.data.snapshot.conversation_id,
    );
    expect(serialized).not.toContain("Bearer");
    expect(serialized).not.toContain("atk");
  });
});
