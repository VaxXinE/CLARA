import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const roadmap = readFileSync(
  join(process.cwd(), "../docs/product/CLARA-P19-ROADMAP.md"),
  "utf8",
);

describe("P19 real CRM roadmap", () => {
  it("marks P19-PR-02 complete, P19-PR-03 current, and P19-PR-04 next", () => {
    expect(roadmap).toContain("P19-PR-02 is complete");
    expect(roadmap).toContain("P19-PR-03 is current");
    expect(roadmap).toContain("P19-PR-04 is next");
    expect(roadmap).toContain(
      "Internal CRM Deployment Runtime + Environment Hardening",
    );
  });
});
