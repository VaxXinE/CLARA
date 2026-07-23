import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P14 final internal beta security review", () => {
  it("keeps server authority and secret handling constraints explicit", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P14-INTERNAL-BETA-FINAL-SECURITY-REVIEW.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain(
      "AuthContext and workspace membership remain source of truth",
    );
    expect(doc).toContain("client-supplied workspaceId is not authoritative");
    expect(doc).toContain(
      "Secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data must not be included in handoff, feedback, logs, docs, or runbooks",
    );
  });
});
