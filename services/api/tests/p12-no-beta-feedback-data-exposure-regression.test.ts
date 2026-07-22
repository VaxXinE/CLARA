import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-BETA-FEEDBACK-PRIVACY-BOUNDARY.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 no beta feedback data exposure regression", () => {
  it("forbids credential-looking examples in feedback privacy docs", () => {
    for (const unsafe of [
      "sk_live_",
      "xoxb-",
      "ya29.",
      "ghp_",
      "BEGIN PRIVATE KEY",
      "Authorization: Bearer ",
    ]) {
      expect(doc).not.toContain(unsafe);
    }
  });
});
