import { describe, expect, it } from "vitest";
import { redactExtensionSnapshotPii } from "../src/ai/extension-snapshot-pii-redaction";

describe("P17 extension snapshot PII redaction payment-like values", () => {
  it("masks payment-like card values and URLs with secrets", () => {
    const result = redactExtensionSnapshotPii(
      "card 4111 1111 1111 1111 https://example.test/path?token=abc",
    );

    expect(result).toBe("card [redacted] [redacted]");
  });
});
