import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 evidence privacy boundary", () => {
  it("requires redacted evidence and customer-data minimization", () => {
    const doc = readFileSync(
      resolve(root, "docs/product/CLARA-P15-EVIDENCE-PRIVACY-BOUNDARY.md"),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("Evidence may include safe command names");
    expect(doc).toContain(
      "Evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data",
    );
    expect(doc).toContain("Evidence should minimize customer-sensitive data");
  });
});
