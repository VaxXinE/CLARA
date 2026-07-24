import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-ALLOWED-CAPTURE-POLICY.md";

describe("P16 extension-assisted allowed capture policy", () => {
  it("exists and limits allowed capture to safe active-chat fields", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain(
      "allowed capture is limited to visible active-chat message text, safe display names/titles, channel identifier, direction, timestamps/timestamp labels, selected conversation metadata needed for dedup/linking, and snapshot hash",
    );
  });
});
