import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const docs = [
  "docs/product/CLARA-P19-REAL-WORKSPACE-USER-ROLE-BOOTSTRAP.md",
  "docs/product/CLARA-P19-FIRST-OWNER-BOOTSTRAP-RUNBOOK.md",
  "docs/product/CLARA-P19-INTERNAL-TEAM-ACCESS-RUNBOOK.md",
  "docs/product/CLARA-P19-WORKSPACE-MEMBERSHIP-RUNTIME-POLICY.md",
  "docs/product/CLARA-P19-ROLE-ACCESS-MATRIX.md",
  "docs/product/CLARA-P19-MISSING-MEMBERSHIP-TROUBLESHOOTING.md",
  "docs/product/CLARA-P19-INTERNAL-TEAM-ONBOARDING-CHECKLIST.md",
  "docs/product/CLARA-P19-ROADMAP.md",
].map((file) => readFileSync(resolve(process.cwd(), "..", "..", file), "utf8"));

describe("P19 real user role roadmap", () => {
  it("documents P19-PR-02 internal team access guardrails", () => {
    const text = docs.join("\n").replace(/\s+/g, " ");

    expect(text).toContain("P19-PR-01 is complete");
    expect(text).toContain("P19-PR-02 is current");
    expect(text).toContain("P19-PR-03 is next");
    expect(text).toContain("Internal team usage must use provider auth");
    expect(text).toContain("Mock/demo mode is dev/test only");
    expect(text).toContain("First owner bootstrap is required for real internal usage");
    expect(text).toContain("Real workspace membership is required");
    expect(text).toContain("Backend AuthContext/workspace membership is source of truth");
    expect(text).toContain("client-supplied workspaceId is not authoritative");
    expect(text).toContain("Missing/inactive membership fails closed");
    expect(text).toContain("Viewer is read-only");
    expect(text).toContain("Owner/agent CRM mutation policy remains enforced");
  });
});
