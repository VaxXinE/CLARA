import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P14 internal feedback severity policy", () => {
  it("classifies security and isolation concerns as stop-the-rollout feedback", () => {
    const policy = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P14-INTERNAL-FEEDBACK-SEVERITY-POLICY.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(policy).toContain("S1");
    expect(policy).toContain("P0");
    expect(policy).toContain("Workspace isolation");
    expect(policy).toContain(
      "authorization concerns must be treated as at least S1/P0",
    );
  });
});
