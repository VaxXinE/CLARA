import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docs = [
  "docs/product/CLARA-P18-CONTROLLED-INTERNAL-RUNTIME-TRIAL-SCOPE.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-PARTICIPANT-RULES.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ENVIRONMENT-BOUNDARY.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-SUCCESS-METRICS.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-PLAN.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-TEMPLATE.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-PRIVACY-POLICY.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-RISK-REGISTER.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-STOP-CRITERIA.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-MANUAL-ROLLBACK-GUIDANCE.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-OPERATOR-CHECKLIST.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ADMIN-CHECKLIST.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ROADMAP.md",
];

function bundle() {
  return docs
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n")
    .replace(/\s+/g, " ");
}

describe("P18 controlled internal runtime trial scope", () => {
  it("opens P18 with all required trial planning docs", () => {
    for (const doc of docs) {
      expect(existsSync(resolve(root, doc)), doc).toBe(true);
    }

    const text = bundle();
    expect(text).toContain(
      "P17 Real AI Analysis Activation is complete for controlled internal use",
    );
    expect(text).toContain(
      "P18 Controlled Internal Runtime Trial + Operational Readiness is current",
    );
    expect(text).toContain("P18-PR-01 is complete");
    expect(text).toContain("P18-PR-02 is current");
    expect(text).toContain(
      "P18 validates controlled internal runtime behavior only",
    );
    expect(text).toContain(
      "extension snapshot -> sanitization/redaction -> workspace/operator attribution -> backend ingestion/dedup -> AI-ready context -> controlled backend real AI analysis -> safe persistence -> dashboard review UI",
    );
  });
});
