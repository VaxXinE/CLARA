import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const policy = readFileSync(
  join(
    __dirname,
    "../../../docs/product/CLARA-P8-WORKFLOW-INTELLIGENCE-POLICY.md",
  ),
  "utf8",
);

describe("P8 Workflow Intelligence Policy", () => {
  it("keeps workflow intelligence suggestion-only until human approval", () => {
    expect(policy).toContain("Workflow Intelligence Policy");
    expect(policy).toContain("suggestion-only");
    expect(policy).toContain("reviewable workflow proposals");
    expect(policy).toContain("human approval");
    expect(policy).toContain("Backend AuthContext");
    expect(policy).toContain("workspace-scoped");
  });

  it("does not let P7 AI output become direct CRM mutation authority", () => {
    expect(policy).toContain("P7 AI output is untrusted");
    expect(policy).toContain("auto-write customer notes");
    expect(policy).toContain("auto-create tasks");
    expect(policy).toContain("auto-assign owners");
  });
});
