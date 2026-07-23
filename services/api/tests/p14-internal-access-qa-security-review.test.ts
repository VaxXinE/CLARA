import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

function readDocs(...files: string[]) {
  return files
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n")
    .replace(/\s+/g, " ");
}

describe("P14 internal access QA security review", () => {
  it("documents the internal access QA and security review gate", () => {
    const docs = readDocs(
      "docs/product/CLARA-P14-INTERNAL-ACCESS-QA-CHECKLIST.md",
      "docs/product/CLARA-P14-INTERNAL-SECURITY-REVIEW.md",
      "docs/product/CLARA-P14-INTERNAL-ROLE-ACCESS-REVIEW.md",
      "docs/product/CLARA-P14-WORKSPACE-ISOLATION-QA.md",
      "docs/product/CLARA-P14-INTERNAL-DATA-IMPORT-SECURITY-REVIEW.md",
    );

    expect(docs).toContain("P14-PR-01 is complete");
    expect(docs).toContain("P14-PR-02 is complete");
    expect(docs).toContain("P14-PR-03 is complete");
    expect(docs).toContain("P14-PR-04 is current");
    expect(docs).toContain("Internal access QA is for internal beta rollout");
    expect(docs).toContain(
      "Owner/admin/operator/viewer access boundaries are reviewed",
    );
  });
});
