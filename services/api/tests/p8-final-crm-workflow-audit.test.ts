import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const finalAuditDoc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P8-FINAL-CRM-WORKFLOW-INTELLIGENCE-AUDIT.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P8 final CRM workflow audit", () => {
  it("documents every P8 PR closure and handoff to P9", () => {
    for (const pattern of [
      "P8-PR-01",
      "P8-PR-02",
      "P8-PR-03",
      "P8-PR-04",
      "P8-PR-05",
      "P8-PR-06",
      "P8-PR-07",
      "P8-PR-08",
      "P8-PR-09",
      "P8 complete",
      "P9 Analytics / Reporting / KPI",
    ]) {
      expect(finalAuditDoc).toContain(pattern);
    }
  });

  it("documents the final security guarantees", () => {
    for (const pattern of [
      "Backend AuthContext",
      "workspace-scoped",
      "read-only",
      "review-only",
      "readiness-only",
      "audit-only",
      "mutationExecuted=false",
      "actionExecuted=false",
      "no CRM mutation",
      "no task creation",
      "no owner assignment mutation",
      "no lifecycle mutation",
      "no status mutation",
      "no outbound send",
      "no real AI provider",
    ]) {
      expect(finalAuditDoc).toContain(pattern);
    }
  });
});
