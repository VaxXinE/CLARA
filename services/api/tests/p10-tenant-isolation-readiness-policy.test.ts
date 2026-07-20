import { describe, expect, it } from "vitest";
import { getTenantIsolationReadinessChecks } from "../src/enterprise/tenant-isolation-readiness-policy";

describe("P10 tenant isolation readiness policy", () => {
  it("defines critical backend authority and workspace boundary checks", () => {
    const checks = getTenantIsolationReadinessChecks();

    expect(checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          checkKey: "backend_auth_context",
          status: "ready",
          severity: "critical",
        }),
        expect.objectContaining({
          checkKey: "client_workspace_non_authority",
          status: "ready",
          severity: "critical",
        }),
      ]),
    );
  });
});
