import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "../../../");

function readRepoFile(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("P8 CRM security boundary", () => {
  it("documents incident handling for unsafe CRM workflow behavior", () => {
    const runbook = readRepoFile("docs/product/CLARA-P8-SECURITY-RUNBOOK.md");

    expect(runbook).toContain("Unauthorized CRM Mutation");
    expect(runbook).toContain("Cross-Workspace CRM Access");
    expect(runbook).toContain("Suspected AI-Driven CRM Mutation");
    expect(runbook).toContain("no autonomous CRM mutation");
    expect(runbook).toContain("no auto-write customer note");
    expect(runbook).toContain("no auto-create task");
  });

  it("does not add CRM mutation routes in P8-PR-01", () => {
    const routes = readRepoFile("services/api/src/http/server.ts");

    expect(routes).not.toContain("/api/v1/crm/mutations");
    expect(routes).not.toContain("/api/v1/tasks");
    expect(routes).not.toContain("/api/v1/customer-notes");
  });
});
