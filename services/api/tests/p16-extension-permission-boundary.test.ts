import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath = "docs/product/CLARA-P16-EXTENSION-PERMISSION-BOUNDARY.md";

describe("P16 extension permission boundary", () => {
  it("exists and keeps backend authorization authoritative", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain(
      "AuthContext and workspace membership remain source of truth",
    );
    expect(doc).toContain("client-supplied workspaceId is not authoritative");
    expect(doc).toContain("The extension cannot grant roles");
  });
});
