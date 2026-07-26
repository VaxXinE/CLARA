import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = [
  "README.md",
  "docs/product/CLARA-FINAL-ROADMAP.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ROADMAP.md",
  "docs/product/CLARA-P18-FINAL-TRIAL-DECISION-RECORD.md",
]
  .map((file) => readFileSync(resolve(root, file), "utf8"))
  .join("\n");

describe("P18 final no production launch regression", () => {
  it("keeps final gate from claiming production or public GA", () => {
    expect(text).toContain("P18 is not production deployment");
    expect(text).toContain("P18 is not public SaaS launch");
    expect(text).not.toContain("P18 is production deployment");
    expect(text).not.toContain("P18 is public SaaS launch");
  });
});
