import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-BETA-SUPPORT-SLA-POLICY.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 beta support SLA policy", () => {
  it("defines support severity levels", () => {
    for (const severity of [
      "S0 security/data exposure/blocker",
      "S1 beta-breaking core workflow",
      "S2 important but workaround exists",
      "S3 minor UX/docs issue",
      "S4 feedback/enhancement",
    ]) {
      expect(doc).toContain(severity);
    }
  });
});
