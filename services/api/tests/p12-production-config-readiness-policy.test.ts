import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-PRODUCTION-CONFIG-READINESS-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 production config readiness policy", () => {
  it("requires safe API dashboard extension auth workspace config checks", () => {
    for (const phrase of [
      "API runtime config",
      "Dashboard runtime config",
      "Extension runtime config",
      "Auth provider / JWKS / issuer",
      "Workspace membership",
      "Provider readiness",
      "Billing readiness remains read-only",
      "AI review-only surfaces",
      "Analytics safe-summary surfaces",
    ]) {
      expect(doc).toContain(phrase);
    }
  });
});
