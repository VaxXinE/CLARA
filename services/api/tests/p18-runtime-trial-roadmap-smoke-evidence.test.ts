import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = [
  "README.md",
  "docs/product/CLARA-FINAL-ROADMAP.md",
  "docs/product/CLARA-DOCUMENTATION-INDEX.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ROADMAP.md",
]
  .map((file) => readFileSync(resolve(root, file), "utf8"))
  .join("\n");

describe("P18 runtime trial roadmap smoke evidence", () => {
  it("marks P18-PR-01 complete and P18-PR-02 current", () => {
    expect(text).toContain("P18-PR-01 is complete");
    expect(text).toContain("P18-PR-02 is current");
    expect(text).toContain("P18 validates controlled internal runtime behavior only");
    expect(text).toContain("smoke checklist");
    expect(text).toContain("pass/fail criteria");
    expect(text).toContain("evidence capture");
    expect(text).toContain("issue capture");
    expect(text).toContain("blocker severity rules");
    expect(text).toContain("retention/disposal");
    expect(text).toContain("stop criteria");
    expect(text).toContain("rollback references");
  });
});
