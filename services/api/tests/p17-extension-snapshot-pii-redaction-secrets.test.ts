import { describe, expect, it } from "vitest";
import { redactExtensionSnapshotPii } from "../src/ai/extension-snapshot-pii-redaction";

const key = (...parts: string[]) => parts.join("_");

describe("P17 extension snapshot PII redaction secrets", () => {
  it("masks bearer values, token fields, auth headers, cookies, and API keys", () => {
    const result = redactExtensionSnapshotPii(
      [
        "Bearer atk",
        `${key("access", "token")}=atk`,
        `${key("api", "key")}=k`,
        "authorization=atk",
        "cookie=sid",
      ].join(" "),
    );

    expect(result).not.toContain("atk");
    expect(result).not.toContain("sid");
    expect(result).toContain("[redacted]");
  });
});
