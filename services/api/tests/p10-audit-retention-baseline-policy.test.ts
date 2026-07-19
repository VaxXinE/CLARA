import { describe, expect, it } from "vitest";
import {
  auditEventCategories,
  getAuditRetentionBaselinePolicy,
} from "../src/enterprise/audit-retention-baseline-policy";

describe("P10 audit retention baseline policy", () => {
  it("defines safe audit metadata and planned retention readiness", () => {
    const policy = getAuditRetentionBaselinePolicy();

    expect(policy.auditEventCategories).toEqual(auditEventCategories);
    expect(policy.safeMetadata).toContain("workspace_id");
    expect(policy.safeMetadata).toContain("correlation_id");
    expect(policy.prohibitedMetadata).toContain("credential material");
    expect(policy.prohibitedMetadata).toContain("provider raw payloads");
    expect(policy.retentionReadiness).toBe("planned");
    expect(policy.incidentInvestigationReadiness).toBe("partially_ready");
  });
});
