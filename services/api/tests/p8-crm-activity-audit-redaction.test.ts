import { describe, expect, it } from "vitest";
import {
  sanitizeCrmActivityAuditMetadata,
  toAuditLogMetadata,
} from "../src/customers/customer-crm-activity-audit-redaction";

describe("P8 CRM activity audit redaction", () => {
  it("drops unknown metadata and preserves safe allowlisted fields", () => {
    const { safeMetadata } = sanitizeCrmActivityAuditMetadata({
      proposalType: "follow_up",
      recommendedAction: "review_customer",
      access_token: "atk",
      rawProviderPayload: "payload",
    } as Record<string, unknown>);

    expect(safeMetadata).toMatchObject({
      proposalType: "follow_up",
      recommendedAction: "review_customer",
      redactionApplied: true,
      mutationExecuted: false,
      actionExecuted: false,
      reviewOnly: true,
    });
    expect(JSON.stringify(safeMetadata)).not.toContain("atk");
    expect(JSON.stringify(safeMetadata)).not.toContain("payload");
  });

  it("maps safe metadata to audit log scalar fields only", () => {
    const metadata = toAuditLogMetadata(
      {
        proposalType: "status_review",
        readinessLevel: "ready_for_review",
        recommendedAction: "review_lifecycle_status",
        blockedReason: null,
        redactionApplied: false,
        mutationExecuted: false,
        actionExecuted: false,
        reviewOnly: true,
      },
      {
        source: "lifecycle_status_readiness",
        riskLevel: "medium",
        policyVersion: "p8-crm-activity-audit-v1",
        outcome: "viewed",
      },
    );

    expect(metadata).toMatchObject({
      source: "lifecycle_status_readiness",
      risk_level: "medium",
      mutation_executed: false,
      action_executed: false,
      review_only: true,
    });
    expect(JSON.stringify(metadata)).not.toContain("access_token");
    expect(JSON.stringify(metadata)).not.toContain("refresh_token");
    expect(JSON.stringify(metadata)).not.toContain("Authorization");
  });
});
