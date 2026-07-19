import { describe, expect, it } from "vitest";
import { sanitizeCrmActivityAuditMetadata } from "../src/customers/customer-crm-activity-audit-redaction";

describe("P8 final CRM workflow audit redaction", () => {
  it("drops unknown or sensitive audit metadata and keeps allowlisted fields", () => {
    const { safeMetadata, redactionApplied } = sanitizeCrmActivityAuditMetadata(
      {
        proposalType: "follow_up_task_review",
        recommendedAction: "review_customer",
        accessToken: "atk",
        refreshToken: "rtk",
        rawProviderPayload: "payload",
        arbitrary: "drop-me",
      } as Record<string, unknown>,
    );

    expect(safeMetadata.proposalType).toBe("follow_up_task_review");
    expect(safeMetadata.recommendedAction).toBe("review_customer");
    expect(safeMetadata.redactionApplied).toBe(true);
    expect(redactionApplied).toBe(true);
    expect("accessToken" in safeMetadata).toBe(false);
    expect("refreshToken" in safeMetadata).toBe(false);
    expect("rawProviderPayload" in safeMetadata).toBe(false);
    expect("arbitrary" in safeMetadata).toBe(false);
  });
});
