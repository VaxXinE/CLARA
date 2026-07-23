import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P14 final internal beta go/no-go checklist", () => {
  it("requires internal-only, non-launch, security, and limitations gates", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P14-INTERNAL-BETA-GO-NO-GO-CHECKLIST.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain(
      "Internal beta go-live is controlled internal usage only",
    );
    expect(doc).toContain("Internal beta is not public SaaS launch");
    expect(doc).toContain(
      "Internal beta is not production deployment claim unless separately executed",
    );
    expect(doc).toContain("billing/payment is deferred");
    expect(doc).toContain("provider/AI/outbound activation remains controlled");
    expect(doc).toContain(
      "Known limitations must be reviewed before broader rollout",
    );
  });
});
