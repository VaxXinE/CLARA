import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal beta participant rules", () => {
  it("keeps participant rules role-scoped and read-only for viewers", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-INTERNAL-BETA-PARTICIPANT-RULES.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("Participants must use assigned internal accounts");
    expect(doc).toContain("Viewers stay read-only");
    expect(doc).toContain(
      "AuthContext and workspace membership remain source of truth",
    );
    expect(doc).toContain("client-supplied workspaceId is not authoritative");
  });
});
