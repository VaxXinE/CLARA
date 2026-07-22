import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const docs = [
  "CLARA-P12-RC-VALIDATION-RUNBOOK.md",
  "CLARA-P12-RELEASE-CANDIDATE-VALIDATION-MATRIX.md",
  "CLARA-P12-OPERATIONAL-SMOKE-CHECKLIST.md",
].map((name) =>
  readFileSync(
    new URL(`../../../docs/product/${name}`, import.meta.url),
    "utf8",
  ),
);

describe("P12 RC no production launch regression", () => {
  it("states RC is not GA or production deployment", () => {
    const text = docs.join("\n");

    expect(text).toContain(
      "Release Candidate is a validation gate, not a launch",
    );
    expect(text).toContain("CLARA is not GA yet");
    expect(text).toContain("CLARA is not production deployed yet");
    expect(text).toContain("Production deployment");
  });
});
