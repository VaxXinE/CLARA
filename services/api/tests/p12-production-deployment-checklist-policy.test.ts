import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-PRODUCTION-DEPLOYMENT-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 production deployment checklist policy", () => {
  it("defines deployment as readiness, not execution", () => {
    expect(doc).toContain("P12-PR-01 is complete");
    expect(doc).toContain("P12-PR-02 is complete");
    expect(doc).toContain("P12-PR-03 is current");
    expect(doc).toContain("CLARA is not GA yet");
    expect(doc).toContain("CLARA is not production deployed yet");
    expect(doc).toContain(
      "The deployment checklist is a readiness gate, not deployment execution",
    );
  });

  it("covers all production readiness areas", () => {
    for (const area of [
      "API",
      "Dashboard",
      "Extension",
      "Auth",
      "Workspace",
      "Database",
      "Backup",
      "Secrets",
      "CORS",
      "TLS",
      "DNS",
      "Logging/Redaction",
      "Rate Limit",
      "Provider readiness",
      "Billing readiness",
      "AI review-only",
      "Analytics safe-summary",
      "Extension boundary",
    ]) {
      expect(doc).toContain(area);
    }
  });
});
