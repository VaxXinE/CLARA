import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal UAT admin script", () => {
  it("keeps admin UAT read-safe and backend scoped", () => {
    const doc = readFileSync(
      resolve(root, "docs/product/CLARA-P15-INTERNAL-UAT-ADMIN-SCRIPT.md"),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("no invite, role update, delete, billing");
    expect(doc).toContain(
      "workspace scope is derived from backend AuthContext",
    );
  });
});
