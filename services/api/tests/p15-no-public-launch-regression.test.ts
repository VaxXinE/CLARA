import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 no public launch regression", () => {
  it("keeps controlled internal beta separate from public SaaS launch", () => {
    const docs = [
      "README.md",
      "docs/product/CLARA-FINAL-ROADMAP.md",
      "docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-EXECUTION-SCOPE.md",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n")
      .replace(/\s+/g, " ");

    expect(docs).toContain(
      "controlled internal beta is not public SaaS launch",
    );
    expect(docs).not.toContain("Public SaaS launch is complete");
    expect(docs).not.toContain("CLARA public GA launch happened.");
  });
});
