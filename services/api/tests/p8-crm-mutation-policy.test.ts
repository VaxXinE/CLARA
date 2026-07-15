import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const policy = readFileSync(
  join(__dirname, "../../../docs/product/CLARA-P8-CRM-MUTATION-POLICY.md"),
  "utf8",
);

describe("P8 CRM Mutation Policy", () => {
  it("requires backend authority, human approval, and audit log coverage", () => {
    expect(policy).toContain("CRM Mutation Policy");
    expect(policy).toContain("Backend AuthContext");
    expect(policy).toContain("workspace-scoped");
    expect(policy).toContain("human approval");
    expect(policy).toContain("audit log");
  });

  it("separates allowed, restricted, and blocked CRM actions", () => {
    expect(policy).toContain("view customer profile");
    expect(policy).toContain("create task");
    expect(policy).toContain("save customer note");
    expect(policy).toContain("no autonomous CRM mutation");
    expect(policy).toContain("no auto-write customer note");
    expect(policy).toContain("no auto-create task");
    expect(policy).toContain("cross-workspace CRM mutation");
  });
});
