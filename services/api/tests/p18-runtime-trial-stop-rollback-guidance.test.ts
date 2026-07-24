import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = [
  "docs/product/CLARA-P18-RUNTIME-TRIAL-STOP-CRITERIA.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-MANUAL-ROLLBACK-GUIDANCE.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-RISK-REGISTER.md",
]
  .map((file) => readFileSync(resolve(root, file), "utf8"))
  .join("\n");

describe("P18 runtime trial stop and rollback guidance", () => {
  it("requires stop criteria, rollback guidance, and limitation review", () => {
    expect(text).toContain("Stop criteria are required before broader rollout");
    expect(text).toContain(
      "Manual rollback guidance is required before broader rollout",
    );
    expect(text).toContain(
      "Known limitations must be reviewed before broader rollout",
    );
  });
});
