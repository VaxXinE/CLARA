import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-RUNTIME-TRIAL-ISSUE-DISPOSITION.md"),
  "utf8",
);

describe("P18 runtime trial issue disposition", () => {
  it("captures issues with severity and safe evidence references", () => {
    expect(text).toContain("P18-PR-02 is complete");
    expect(text).toContain("P18-PR-03 is current");
    expect(text).toContain("known_issue_id");
    expect(text).toContain("severity");
    expect(text).toContain("blocker");
    expect(text).toContain("safe_summary");
    expect(text).toContain("Known limitations must be reviewed before broader rollout");
    expect(text).toContain("Stop criteria and manual rollback references must remain visible");
  });
});
