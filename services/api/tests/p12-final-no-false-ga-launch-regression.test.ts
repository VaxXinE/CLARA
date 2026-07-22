import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const docs = [
  "CLARA-P12-FINAL-GA-AUDIT-RUNBOOK.md",
  "CLARA-P12-FINAL-RELEASE-READINESS-SUMMARY.md",
  "CLARA-P12-POST-P12-HANDOFF.md",
]
  .map((file) =>
    readFileSync(
      new URL(`../../../docs/product/${file}`, import.meta.url),
      "utf8",
    ),
  )
  .join("\n");

describe("P12 final no false GA launch regression", () => {
  it("does not claim public GA has happened", () => {
    expect(docs).toContain(
      "P12 completion does not mean public GA launch happened",
    );
    expect(docs).not.toMatch(/public GA launch has happened/i);
    expect(docs).not.toMatch(/CLARA is GA live/i);
  });
});
