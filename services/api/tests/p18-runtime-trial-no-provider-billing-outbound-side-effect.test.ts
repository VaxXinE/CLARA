import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = [
  "docs/product/CLARA-P18-CONTROLLED-INTERNAL-RUNTIME-TRIAL-SCOPE.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ADMIN-CHECKLIST.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-STOP-CRITERIA.md",
]
  .map((file) => readFileSync(resolve(root, file), "utf8"))
  .join("\n");

describe("P18 runtime trial provider billing outbound side effects", () => {
  it("does not activate billing, official providers, or auto-send", () => {
    expect(text).toContain("P18 does not activate billing/payment");
    expect(text).toContain("P18 does not activate official WA/IG/TikTok APIs");
    expect(text).toContain("P18 does not enable outbound auto-send");
  });
});
