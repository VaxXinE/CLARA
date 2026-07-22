import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("P13 internal CRM billing deferred policy", () => {
  it("documents that billing/payment is deferred while P13 activates internal CRM", () => {
    const roadmap = readFileSync(
      resolve(
        process.cwd(),
        "../../docs/product/CLARA-P13-INTERNAL-CRM-ACTIVATION-ROADMAP.md",
      ),
      "utf8",
    );
    const policy = readFileSync(
      resolve(
        process.cwd(),
        "../../docs/product/CLARA-P13-BILLING-DEFERRED-POLICY.md",
      ),
      "utf8",
    );

    expect(roadmap).toContain("P13 is current");
    expect(roadmap).toContain("P13 focuses internal CRM usage");
    expect(policy).toContain("billing/payment is deferred");
    expect(policy).toContain("CLARA is not production deployed yet");
    expect(policy).toContain("CLARA is not public GA launched yet");
  });
});
