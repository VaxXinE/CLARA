import { describe, expect, it } from "vitest";
import {
  buildBaseCrmActivityAuditMetadata,
  crmActivityAuditMetadataKeys,
  crmActivityAuditPolicyVersion,
  isAllowedCrmActivityAuditEventType,
} from "../src/customers/customer-crm-activity-audit-policy";

describe("P8 CRM activity audit policy", () => {
  it("allows only known P8 audit event types", () => {
    expect(crmActivityAuditPolicyVersion).toBe("p8-crm-activity-audit-v1");
    expect(
      isAllowedCrmActivityAuditEventType(
        "p8_customer_profile_intelligence_viewed",
      ),
    ).toBe(true);
    expect(isAllowedCrmActivityAuditEventType("p9_kpi_event")).toBe(false);
  });

  it("forces review-only non-execution metadata", () => {
    expect(crmActivityAuditMetadataKeys).toContain("reviewOnly");
    expect(buildBaseCrmActivityAuditMetadata()).toMatchObject({
      mutationExecuted: false,
      actionExecuted: false,
      reviewOnly: true,
    });
  });
});
