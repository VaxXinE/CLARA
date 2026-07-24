import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-PRIVACY-REVIEW.md"),
  "utf8",
);

describe("P18 runtime trial evidence privacy review", () => {
  it("blocks sensitive evidence and preserves AI/workspace boundaries", () => {
    expect(text).toContain("P18-PR-03 is current");
    expect(text).toContain("Confirm no secrets/tokens/cookies/auth headers are present");
    expect(text).toContain("Confirm no raw provider payload/raw webhook payload is present");
    expect(text).toContain("Confirm no raw HTML/raw DOM is present");
    expect(text).toContain("Confirm no raw prompts/raw customer messages as prompts are present");
    expect(text).toContain("AI provider secrets remain server-only");
    expect(text).toContain("client-supplied workspaceId is not authoritative");
  });
});
