import { describe, expect, it } from "vitest";
import { normalizeSnapshot } from "../sync/snapshot-normalization";

describe("P16 final extension-assisted ingestion boundary", () => {
  it("does not expand capture, provider APIs, AI calls, or auto-send", () => {
    const snapshot = normalizeSnapshot(
      {
        channel: "tiktok",
        captured_at: "2026-07-24T00:00:00.000Z",
        chat_title: "Lead",
        messages: [{ id: "m1", direction: "incoming", text: "hello" }],
      },
      "snapshot_hash_final_boundary",
    );
    const serialized = JSON.stringify(snapshot);

    expect(serialized).not.toContain("auto_send");
    expect(serialized).not.toContain('official_api":true');
    expect(serialized).not.toContain("ai_provider");
    expect(serialized).not.toContain("checkout");
  });
});
