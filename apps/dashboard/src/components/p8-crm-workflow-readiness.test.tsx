import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";
import appSource from "../App.tsx?raw";

describe("P8 CRM workflow readiness", () => {
  it("documents CRM workflow as readiness-only in the dashboard", () => {
    expect(dashboardReadme).toContain("P8 CRM & Workflow Intelligence");
    expect(dashboardReadme).toContain("workflow readiness");
    expect(dashboardReadme).toContain("no autonomous CRM mutation");
    expect(dashboardReadme).toContain("no auto-write customer note");
    expect(dashboardReadme).toContain("no auto-create task");
  });

  it("does not add dashboard CRM mutation controls in P8-PR-01", () => {
    expect(appSource).not.toContain("Auto Write Customer Note");
    expect(appSource).not.toContain("Auto Create Task");
    expect(appSource).not.toContain("Auto Assign Owner");
    expect(appSource).not.toContain("dangerouslySetInnerHTML");
  });
});
