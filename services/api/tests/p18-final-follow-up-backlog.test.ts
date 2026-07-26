import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-FINAL-FOLLOW-UP-BACKLOG.md"),
  "utf8",
);

describe("P18 final follow-up backlog", () => {
  it("requires explicit approval for future work", () => {
    expect(text).toContain("Follow-up backlog entries are not automatic implementation approval");
    expect(text).toContain("The next phase requires separate explicit approval");
    expect(text).toContain("AuthContext and workspace membership remain source of truth");
    expect(text).toContain("Client-supplied workspaceId is not authoritative");
  });
});
