import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal beta escalation rules", () => {
  it("documents stop-the-line escalations for unsafe beta behavior", () => {
    const doc = readFileSync(
      resolve(root, "docs/product/CLARA-P15-INTERNAL-BETA-ESCALATION-RULES.md"),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("Stop-The-Line Escalations");
    expect(doc).toContain("Auth, role, workspace isolation");
    expect(doc).toContain("accidental provider, AI, outbound");
    expect(doc).toContain("Escalation remains manual/local/repo-safe");
  });
});
