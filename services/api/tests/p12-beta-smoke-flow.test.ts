import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-BETA-SMOKE-FLOW.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 Beta smoke flow", () => {
  it("keeps Beta limited, controlled, and known-limitations-aware", () => {
    expect(doc).toContain("Beta users are limited and known");
    expect(doc).toContain("Workspace access is controlled");
    expect(doc).toContain("Known limitations are published");
    expect(doc).toContain("Release Candidate validation has passed");
    expect(doc).toContain("does not mean GA");
  });
});
