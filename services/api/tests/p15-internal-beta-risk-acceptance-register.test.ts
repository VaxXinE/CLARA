import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P15-INTERNAL-BETA-RISK-ACCEPTANCE-REGISTER.md";

describe("P15 internal beta risk acceptance register", () => {
  it("exists and keeps risk acceptance safe and explicit", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain("Accepted by owner/admin");
    expect(doc).toContain("Expiry or revisit date");
    expect(doc).toContain("client-supplied workspaceId is not authoritative");
  });
});
