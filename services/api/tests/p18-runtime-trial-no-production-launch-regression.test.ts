import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = [
  "README.md",
  "docs/product/CLARA-FINAL-ROADMAP.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ENVIRONMENT-BOUNDARY.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ROADMAP.md",
]
  .map((file) => readFileSync(resolve(root, file), "utf8"))
  .join("\n");

describe("P18 runtime trial no production or public launch regression", () => {
  it("keeps P18 internal-only and non-production", () => {
    expect(text).toContain("P18 is not public SaaS launch");
    expect(text).toContain("P18 is not production deployment");
    expect(text).not.toContain("P18 is production deployment");
    expect(text).not.toContain("P18 is public SaaS launch");
  });
});
