import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P15-INTERNAL-RUNTIME-EVIDENCE-LOG-TEMPLATE.md";

describe("P15 internal runtime evidence log template", () => {
  it("exists and captures safe evidence metadata only", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain("Component: API | Dashboard | Extension");
    expect(doc).toContain("Safe evidence summary");
    expect(doc).toContain(
      "Evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data",
    );
    expect(doc).toContain("Evidence should minimize customer-sensitive data");
  });
});
