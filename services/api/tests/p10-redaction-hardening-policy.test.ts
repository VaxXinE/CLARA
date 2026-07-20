import { describe, expect, it } from "vitest";
import { getRedactionClassifierRules } from "../src/enterprise/redaction-hardening-policy";

describe("P10 redaction hardening policy", () => {
  it("defines classifier rules for credentials, sessions, raw payloads, and unsafe rendering", () => {
    const rules = getRedactionClassifierRules();

    expect(rules.map((rule) => rule.classifierKey)).toEqual([
      "credential_fields",
      "session_fields",
      "raw_payload_fields",
      "unsafe_render_fields",
    ]);
    expect(
      rules.every(
        (rule) => rule.severity === "critical" || rule.severity === "warning",
      ),
    ).toBe(true);
  });
});
