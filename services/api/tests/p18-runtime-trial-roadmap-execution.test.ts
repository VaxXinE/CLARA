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

describe("P18 runtime trial roadmap execution", () => {
  it("marks PR03 current and PR04 next", () => {
    expect(text).toContain("P18-PR-02 is complete");
    expect(text).toContain("P18-PR-03 is current");
    expect(text).toContain("P18-PR-04 is next");
    expect(text).toContain("execution log");
    expect(text).toContain("evidence log");
    expect(text).toContain("run summary");
    expect(text).toContain("issue disposition");
    expect(text).toContain("signoff records");
    expect(text).toContain("evidence privacy review");
    expect(text).toContain("stop/rollback decision record");
  });
});
