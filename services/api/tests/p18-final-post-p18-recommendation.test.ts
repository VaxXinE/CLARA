import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-FINAL-POST-P18-RECOMMENDATION.md"),
  "utf8",
);

describe("P18 final post-P18 recommendation", () => {
  it("does not automatically choose production, billing, or GA", () => {
    expect(text).toContain("Post-P18 recommendation must not automatically choose production launch, billing activation, or public GA");
    expect(text).toContain("continue_controlled_internal_runtime_trial");
    expect(text).toContain("prepare_next_phase_scope_for_review");
    expect(text).toContain("The next phase requires separate explicit approval");
    expect(text).toContain("AI provider secrets remain server-only");
    expect(text).toContain("Extension must not call AI providers directly");
  });
});
