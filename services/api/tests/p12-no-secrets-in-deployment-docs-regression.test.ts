import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const docs = [
  "CLARA-P12-PRODUCTION-DEPLOYMENT-CHECKLIST.md",
  "CLARA-P12-SECRETS-ENV-READINESS-CHECKLIST.md",
  "CLARA-P12-ROLLBACK-EVIDENCE-CHECKLIST.md",
].map((name) =>
  readFileSync(
    new URL(`../../../docs/product/${name}`, import.meta.url),
    "utf8",
  ),
);

describe("P12 no secrets in deployment docs regression", () => {
  it("uses policy wording without credential values", () => {
    const text = docs.join("\n");

    for (const unsafe of [
      "sk_live_",
      "xoxb-",
      "ya29.",
      "ghp_",
      "BEGIN PRIVATE KEY",
      "Authorization: Bearer ",
    ]) {
      expect(text).not.toContain(unsafe);
    }

    expect(text).toContain("never secret values");
  });
});
