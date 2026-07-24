import { describe, expect, it } from "vitest";
import { redactExtensionSnapshotPii } from "../src/ai/extension-snapshot-pii-redaction";

describe("P17 extension snapshot PII redaction", () => {
  it("masks emails and phone numbers before AI-ready context", () => {
    const result = redactExtensionSnapshotPii(
      "Email user@example.test or call +62 812-3456-7890",
    );

    expect(result).toBe("Email [redacted] or call [redacted]");
  });
});
