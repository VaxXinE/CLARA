import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-RUNTIME-TRIAL-EXECUTION-LOG.md"),
  "utf8",
);

describe("P18 runtime trial execution log", () => {
  it("keeps execution entries internal, safe, and scoped", () => {
    expect(text).toContain("P18-PR-02 is complete");
    expect(text).toContain("P18-PR-03 is current");
    expect(text).toContain("execution_id");
    expect(text).toContain("checklist_item");
    expect(text).toContain("evidence_refs");
    expect(text).toContain("issue_refs");
    expect(text).toContain("P18 validates controlled internal runtime behavior only");
    expect(text).toContain("AuthContext and workspace membership remain source of truth");
    expect(text).toContain("Client-supplied workspaceId is not authoritative");
  });
});
