import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-BETA-FEEDBACK-PRIVACY-BOUNDARY.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 beta feedback privacy boundary", () => {
  it("forbids raw sensitive feedback data", () => {
    expect(doc).toContain(
      "Feedback/support must not collect raw sensitive data",
    );

    for (const item of [
      "passwords",
      "API keys",
      "access tokens",
      "refresh tokens",
      "cookies",
      "auth headers",
      "service role keys",
      "raw customer messages",
      "raw provider payloads",
      "raw webhook payloads",
      "raw audit metadata",
      "raw telemetry dumps",
      "payment data",
      "full database dumps",
      "raw DOM/HTML",
      "prompt dumps",
      "private personal data not needed for triage",
    ]) {
      expect(doc).toContain(item);
    }
  });
});
