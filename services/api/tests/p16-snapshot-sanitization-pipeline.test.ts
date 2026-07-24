import { describe, expect, it } from "vitest";
import {
  redactExtensionSnapshotText,
  sanitizeExtensionSnapshot,
} from "../src/extension/extension-snapshot-sanitization";

const unsafe = (...parts: string[]) => parts.join("_");

function snapshot() {
  return {
    provider: "extension" as const,
    officialApi: false as const,
    channel: "whatsapp" as const,
    capturedAt: new Date("2026-07-24T00:00:00.000Z"),
    snapshotHash: "snapshot_hash_p16_sanitize",
    chatTitle: `Budi ${unsafe("api", "key")}=abc`,
    chatSubtitle: "Active chat",
    sourceUrlOrigin: "https://web.example.test",
    messages: [
      {
        id: "local-1",
        direction: "incoming" as const,
        author: `Customer ${unsafe("client", "secret")}=abc`,
        text: `Need help. Bearer abc ${unsafe("access", "token")}=abc`,
        timestampLabel: "Today",
        replyContextText: `Previous ${unsafe("refresh", "token")}=abc`,
      },
    ],
  };
}

describe("P16 snapshot sanitization pipeline", () => {
  it("sanitizes extension snapshot text before storage and future AI analysis", () => {
    const sanitized = sanitizeExtensionSnapshot(snapshot());
    const serialized = JSON.stringify(sanitized);

    expect(sanitized.provider).toBe("extension");
    expect(sanitized.officialApi).toBe(false);
    expect(sanitized.messages[0]?.text).toContain("[redacted]");
    expect(serialized).not.toContain("Bearer abc");
    expect(serialized).not.toContain("=abc");
  });

  it("redacts payment-like numeric evidence without dropping safe context", () => {
    const result = redactExtensionSnapshotText(
      "customer says card 4111 1111 1111 1111 failed",
    );

    expect(result).toBe("customer says card [redacted] failed");
  });
});
