import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-FINAL-EVIDENCE-PRIVACY-REVIEW.md"),
  "utf8",
);

describe("P18 final evidence privacy review", () => {
  it("excludes sensitive evidence and preserves source-of-truth boundaries", () => {
    expect(text).toContain("Evidence excludes secrets/tokens/cookies/auth headers");
    expect(text).toContain("Evidence excludes raw provider payload/raw webhook payload");
    expect(text).toContain("Evidence excludes raw HTML/raw DOM");
    expect(text).toContain("Evidence excludes raw prompts/raw customer messages as prompts");
    expect(text).toContain("AI provider secrets remain server-only");
    expect(text).toContain("AuthContext and workspace membership remain source of truth");
    expect(text).toContain("Client-supplied workspaceId is not authoritative");
  });
});
