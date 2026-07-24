import { describe, expect, it } from "vitest";
import { parseExtensionSnapshotPayload } from "../src/extension/extension-snapshot-validation";

const unsafe = (...parts: string[]) => parts.join("_");

function payload() {
  return {
    provider: "extension",
    official_api: false,
    channel: "instagram",
    captured_at: "2026-07-24T00:00:00.000Z",
    snapshot_hash: "snapshot_hash_p16_redaction",
    chat_title: `Lead ${unsafe("api", "key")}=abc`,
    messages: [
      {
        id: "m1",
        direction: "incoming",
        author: "Lead",
        text: `secret note ${unsafe("client", "secret")}=abc`,
        reply_context_text: `old ${unsafe("refresh", "token")}=abc`,
      },
    ],
  };
}

describe("P16 snapshot redaction pipeline", () => {
  it("redacts secret-like text before returning the parsed server snapshot", () => {
    const snapshot = parseExtensionSnapshotPayload({
      channel: "instagram",
      body: payload(),
    });
    const serialized = JSON.stringify(snapshot);

    expect(serialized).toContain("[redacted]");
    expect(serialized).not.toContain("=abc");
    expect(serialized).not.toContain(unsafe("client", "secret"));
    expect(serialized).not.toContain(unsafe("refresh", "token"));
  });
});
