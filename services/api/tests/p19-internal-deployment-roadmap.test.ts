import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("P19 internal deployment roadmap", () => {
  it("marks P19-PR-04 and P19-PR-05 complete", () => {
    const text = readFileSync(
      resolve(process.cwd(), "../../docs/product/CLARA-P19-ROADMAP.md"),
      "utf8",
    );

    expect(text).toContain("P19-PR-03 is complete");
    expect(text).toContain("P19-PR-04 is complete");
    expect(text).toContain("P19-PR-05 is complete");
  });
});
