import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal UAT viewer script", () => {
  it("keeps viewer UAT read-only", () => {
    const doc = readFileSync(
      resolve(root, "docs/product/CLARA-P15-INTERNAL-UAT-VIEWER-SCRIPT.md"),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("viewer can inspect allowed read-only data");
    expect(doc).toContain("viewer cannot mutate CRM records");
  });
});
