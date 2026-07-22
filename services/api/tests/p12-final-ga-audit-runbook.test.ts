import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-FINAL-GA-AUDIT-RUNBOOK.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 final GA audit runbook", () => {
  it("keeps final P12 completion honest", () => {
    for (const phrase of [
      "P12-PR-01 is complete",
      "P12-PR-02 is complete",
      "P12-PR-03 is complete",
      "P12-PR-04 is complete",
      "P12-PR-05 is current",
      "P12 completion means release readiness complete",
      "P12 completion does not mean production deployed",
      "P12 completion does not mean public GA launch happened",
      "Production deployment requires separate explicit approval and execution",
      "Provider/payment/AI/outbound activation remains restricted unless future approved work enables it",
      "Readiness-only/review-only/simulated/demo-safe boundaries remain intact",
    ]) {
      expect(doc).toContain(phrase);
    }
  });

  it("covers the final audit areas", () => {
    for (const area of [
      "Roadmap completion",
      "Beta scope criteria",
      "GA release criteria",
      "Release candidate validation",
      "Smoke test matrix",
      "Deployment checklist",
      "Rollback drill",
      "Beta feedback workflow",
      "Support triage workflow",
      "Known issues workflow",
      "Auth/session",
      "Workspace isolation",
      "Provider readiness",
      "AI review-only boundary",
      "Billing readiness-only boundary",
      "Analytics safe-summary boundary",
      "Enterprise/compliance readiness",
      "Extension safe active-chat boundary",
      "Secret/env readiness",
      "No raw payload exposure",
      "No production side effects",
      "No external support tool side effects",
    ]) {
      expect(doc).toContain(area);
    }
  });
});
