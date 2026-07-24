import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-RUNTIME-TRIAL-PASS-FAIL-CRITERIA.md"),
  "utf8",
);

describe("P18 runtime trial pass/fail criteria", () => {
  it("defines pass criteria and blocker fail criteria", () => {
    expect(text).toContain("Pass Criteria");
    expect(text).toContain("Fail Criteria");
    expect(text).toContain("Controlled backend AI analysis");
    expect(text).toContain("No outbound auto-send occurs");
    expect(text).toContain("Extension calls AI providers directly");
    expect(text).toContain("Client-supplied workspaceId becomes authoritative");
    expect(text).toMatch(/billing\/payment/i);
    expect(text).toContain("production deployment");
  });
});
