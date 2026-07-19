import { describe, expect, it } from "vitest";
import { isAllowedAnalyticsAuditEventName } from "../src/analytics/analytics-audit-policy";

describe("P9 analytics audit policy", () => {
  it("allowlists safe analytics audit events only", () => {
    expect(isAllowedAnalyticsAuditEventName("p9_kpi_dashboard_viewed")).toBe(
      true,
    );
    expect(isAllowedAnalyticsAuditEventName("crm_customer_note_written")).toBe(
      false,
    );
  });
});
