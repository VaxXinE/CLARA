import { describe, expect, it } from "vitest";
import { normalizeSnapshot } from "../sync/snapshot-normalization";

describe("P16 workspace attribution extension boundary", () => {
  it("does not add workspace or organization authority to extension snapshot payloads", () => {
    const snapshot = normalizeSnapshot(
      {
        channel: "tiktok",
        captured_at: "2026-07-24T00:00:00.000Z",
        chat_title: "Lead",
        messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
      },
      "snapshot_hash_workspace",
    );
    const serialized = JSON.stringify(snapshot);

    expect(serialized).not.toContain("workspace_id");
    expect(serialized).not.toContain("organization_id");
    expect(serialized).not.toContain("workspaceId");
    expect(serialized).not.toContain("organizationId");
  });
});
