import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-RUNTIME-TRIAL-SMOKE-CHECKLIST.md"),
  "utf8",
);

describe("P18 runtime trial smoke checklist", () => {
  it("covers the controlled extension-assisted AI analysis pipeline", () => {
    expect(text).toContain("P18-PR-01 is complete");
    expect(text).toContain("P18-PR-02 is complete");
    expect(text).toContain("P18-PR-03 is current");
    expect(text).toMatch(/auth\/session readiness/i);
    expect(text).toContain("Workspace membership boundary");
    expect(text).toContain("Extension active-chat capture boundary");
    expect(text).toContain("Snapshot sanitization/redaction");
    expect(text).toContain("Backend ingestion/dedup");
    expect(text).toContain("AI-ready context");
    expect(text).toContain("Controlled backend AI analysis");
    expect(text).toContain("Safe analysis persistence");
    expect(text).toContain("Dashboard review UI");
    expect(text).toContain("No auto-send");
    expect(text).toContain("No secret exposure");
  });
});
