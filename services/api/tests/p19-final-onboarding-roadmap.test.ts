import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("P19 final onboarding roadmap", () => {
  it("marks P19-PR-05 as the current final onboarding handoff gate", () => {
    const text = readFileSync(
      resolve(process.cwd(), "../../docs/product/CLARA-P19-ROADMAP.md"),
      "utf8",
    );

    expect(text).toContain("P19-PR-04 is complete");
    expect(text).toContain("P19-PR-05 is current/final onboarding handoff gate");
    expect(text).toContain("P19 completion requires P19-PR-05 validation and merge");
  });
});
