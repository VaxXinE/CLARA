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

describe("P18 final roadmap handoff", () => {
  it("marks PR04 as current final gate and documents handoff artifacts", () => {
    expect(text).toContain("P18-PR-03 is complete");
    expect(text).toContain("P18-PR-04 is current/final handoff gate");
    expect(text).toContain("P18 is considered complete only after P18-PR-04 validates and merges");
    expect(text).toMatch(/final runtime trial review/i);
    expect(text).toMatch(/operational handoff/i);
    expect(text).toContain("decision record");
    expect(text).toContain("post-P18 recommendation");
    expect(text).toContain("follow-up backlog");
    expect(text).toContain("The next phase requires separate explicit approval");
  });
});
