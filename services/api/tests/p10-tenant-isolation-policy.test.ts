import { describe, expect, it } from "vitest";
import { getTenantIsolationPolicy } from "../src/enterprise/tenant-isolation-policy";

describe("P10 tenant isolation policy", () => {
  it("keeps backend workspace authority and denies client workspace authority", () => {
    const policy = getTenantIsolationPolicy();

    expect(policy.workspaceScopedReads).toBe(true);
    expect(policy.workspaceScopedWrites).toBe(true);
    expect(policy.backendWorkspaceAuthority).toBe(true);
    expect(policy.clientWorkspaceIdAuthority).toBe(false);
    expect(policy.crossWorkspaceAccessDenied).toBe(true);
    expect(policy.dashboardBoundaryIsUxOnly).toBe(true);
    expect(policy.extensionBoundaryMayNotReadInternals).toBe(true);
  });
});
