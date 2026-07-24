import { describe, expect, it } from "vitest";
import { normalizeSnapshot } from "../sync/snapshot-normalization";

describe("P17 AI provider secret boundary extension", () => {
  it("does not include AI provider secrets in normalized snapshots", () => {
    const snapshot = normalizeSnapshot(
      {
        channel: "whatsapp",
        captured_at: "2026-01-01T00:00:00.000Z",
        chat_title: "Visible chat",
        messages: [
          {
            id: "m1",
            direction: "incoming",
            text: "AI_PROVIDER_API_KEY=k",
          },
        ],
      },
      "hash",
    );

    expect(JSON.stringify(snapshot)).not.toContain("AI_PROVIDER_API_KEY");
    expect(JSON.stringify(snapshot)).not.toContain(" k ");
  });
});
