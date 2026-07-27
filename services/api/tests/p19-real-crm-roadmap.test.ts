import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const roadmap = readFileSync(
  join(process.cwd(), "../../docs/product/CLARA-P19-ROADMAP.md"),
  "utf8",
);

describe("P19 real CRM roadmap", () => {
  it("keeps the P19 roadmap advancing after real CRM workflow runtime", () => {
    expect(roadmap).toContain("P19-PR-02 is complete");
    expect(roadmap).toContain("P19-PR-03 is complete");
    expect(roadmap).toContain("P19-PR-04 is current");
    expect(roadmap).toContain("P19-PR-05 is next");
    expect(roadmap).toContain(
      "Internal CRM Deployment Runtime + Environment Hardening",
    );
  });
});
