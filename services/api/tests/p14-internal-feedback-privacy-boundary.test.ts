import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P14 internal feedback privacy boundary", () => {
  it("rejects unsafe feedback evidence classes in docs and templates", () => {
    const docs = [
      "docs/product/CLARA-P14-INTERNAL-FEEDBACK-PRIVACY-BOUNDARY.md",
      "docs/product/CLARA-P14-INTERNAL-BUG-REPORT-TEMPLATE.md",
      "docs/product/CLARA-P14-INTERNAL-USABILITY-FEEDBACK-TEMPLATE.md",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n")
      .replace(/\s+/g, " ");

    expect(docs).toContain(
      "Feedback must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data",
    );
    expect(docs).toContain("Feedback should minimize customer-sensitive data");
    expect(docs).toContain("Rejected evidence");
  });
});
