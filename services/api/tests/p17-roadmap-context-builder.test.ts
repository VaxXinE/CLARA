import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("P17 roadmap context builder", () => {
  it("marks P17-PR-01 through P17-PR-03 complete and P17-PR-04 current", () => {
    const roadmap = readFileSync(
      join(
        process.cwd(),
        "../../docs/product/CLARA-P17-REAL-AI-ANALYSIS-ROADMAP.md",
      ),
      "utf8",
    );

    expect(roadmap).toContain("P17-PR-01 is complete");
    expect(roadmap).toContain("P17-PR-02 is complete");
    expect(roadmap).toContain("P17-PR-03 is complete");
    expect(roadmap).toContain("P17-PR-04 is current/final validation gate");
  });
});
