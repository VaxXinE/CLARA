import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P14 final internal beta known limitations review", () => {
  it("documents limitations that block broader rollout until reviewed", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P14-INTERNAL-BETA-KNOWN-LIMITATIONS-REVIEW.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain(
      "Known limitations must be reviewed before broader rollout",
    );
    expect(doc).toContain("billing/payment is deferred");
    expect(doc).toContain("provider/AI/outbound activation remains controlled");
    expect(doc).toContain(
      "Feedback/support remains manual/local/repo-safe unless separately approved",
    );
  });
});
