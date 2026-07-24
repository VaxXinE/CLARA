import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-RUNTIME-TRIAL-RUN-SUMMARY.md"),
  "utf8",
);

describe("P18 runtime trial run summary", () => {
  it("summarizes counts without launch or billing claims", () => {
    expect(text).toContain("P18-PR-03 is current");
    expect(text).toContain("passed_items");
    expect(text).toContain("failed_items");
    expect(text).toContain("blocked_items");
    expect(text).toContain("P18 is not public SaaS launch");
    expect(text).toContain("P18 is not production deployment");
    expect(text).toContain("Billing/payment remains deferred");
    expect(text).toContain("Official WA/IG/TikTok APIs remain not activated");
    expect(text).toContain("Outbound auto-send remains disabled");
  });
});
