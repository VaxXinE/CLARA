import { describe, expect, it } from "vitest";
import { normalizeSnapshot } from "../sync/snapshot-normalization";

const unsafe = (...parts: string[]) => parts.join("_");

describe("P16 snapshot redaction extension boundary", () => {
  it("redacts token-like text before the extension sends a snapshot", () => {
    const snapshot = normalizeSnapshot(
      {
        channel: "instagram",
        captured_at: "2026-07-24T00:00:00.000Z",
        chat_title: `${unsafe("api", "key")}=abc`,
        messages: [
          {
            id: "m1",
            direction: "incoming",
            text: `Bearer abc ${unsafe("client", "secret")}=abc`,
            reply_context_text: `${unsafe("refresh", "token")}=abc`,
          },
        ],
      },
      "snapshot_hash_redact",
    );
    const serialized = JSON.stringify(snapshot);

    expect(serialized).toContain("[redacted]");
    expect(serialized).not.toContain("Bearer abc");
    expect(serialized).not.toContain("=abc");
  });
});
