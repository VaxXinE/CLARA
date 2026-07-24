import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-PRIVACY-DATA-MINIMIZATION-POLICY.md";

describe("P16 extension-assisted privacy data minimization", () => {
  it("exists and minimizes captured active-chat data", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain("Capture the smallest active-chat snapshot");
    expect(doc).toContain(
      "Evidence and issue reports should minimize customer-sensitive data",
    );
  });
});
