import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const docs = [
  "CLARA-P12-FINAL-GA-AUDIT-RUNBOOK.md",
  "CLARA-P12-FINAL-SECURITY-BOUNDARY-REVIEW.md",
  "CLARA-P12-FINAL-KNOWN-LIMITATIONS-REVIEW.md",
]
  .map((file) =>
    readFileSync(
      new URL(`../../../docs/product/${file}`, import.meta.url),
      "utf8",
    ),
  )
  .join("\n");

describe("P12 final no provider payment AI activation regression", () => {
  it("keeps restricted activation boundaries intact", () => {
    expect(docs).toContain(
      "Provider/payment/AI/outbound activation remains restricted unless future approved work enables it",
    );
    expect(docs).toContain("Billing readiness-only boundary");
    expect(docs).toContain("AI review-only boundary");
    expect(docs).not.toMatch(/charging customers is live/i);
  });
});
