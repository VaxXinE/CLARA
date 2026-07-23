import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 evidence retention handling policy", () => {
  it("keeps evidence retention manual, local, and repo-safe", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-EVIDENCE-RETENTION-HANDLING-POLICY.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain(
      "repo-safe docs, local notes, or approved internal issue records",
    );
    expect(doc).toContain(
      "Do not forward evidence into email, Slack, Discord, webhook",
    );
    expect(doc).toContain("no external support tool integration is activated");
  });
});
