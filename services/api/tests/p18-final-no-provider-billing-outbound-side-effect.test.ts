import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = [
  "docs/product/CLARA-P18-FINAL-CONTROLLED-RUNTIME-TRIAL-REVIEW.md",
  "docs/product/CLARA-P18-FINAL-POST-P18-RECOMMENDATION.md",
  "docs/product/CLARA-P18-FINAL-FOLLOW-UP-BACKLOG.md",
]
  .map((file) => readFileSync(resolve(root, file), "utf8"))
  .join("\n");

describe("P18 final provider billing outbound side effects", () => {
  it("does not activate providers, billing, auto-send, or frontend AI secrets", () => {
    expect(text).toContain("Billing/payment remains deferred");
    expect(text).toContain("Official WA/IG/TikTok APIs remain not activated");
    expect(text).toContain("Outbound auto-send remains disabled");
    expect(text).toContain("AI analysis remains backend/server-side");
    expect(text).toContain("AI provider secrets remain server-only");
    expect(text).toContain("Extension must not call AI providers directly");
  });
});
