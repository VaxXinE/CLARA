import { describe, expect, it } from "vitest";
import {
  listAnalyticsMetricCatalog,
  listAnalyticsMetricCategories,
  listAnalyticsMetricKeys,
} from "../src/analytics/analytics-metric-registry";

describe("P9 analytics metric registry", () => {
  it("lists compact P9 foundation metric keys", () => {
    expect(listAnalyticsMetricKeys()).toEqual([
      "conversation_total",
      "conversation_open",
      "conversation_closed",
      "conversation_unresolved",
      "conversation_by_channel",
      "conversation_needs_attention",
      "first_response_time_avg",
      "first_response_time_p50",
      "first_response_time_p95",
      "last_response_age",
      "sla_risk_count",
      "unanswered_conversation_count",
      "channel_connected_count",
      "channel_degraded_count",
      "channel_disabled_count",
      "inbound_sync_success_count",
      "inbound_sync_failure_count",
      "outbound_delivery_success_rate",
      "outbound_delivery_failure_count",
      "provider_health_status",
      "crm_profile_intelligence_view_count",
      "crm_timeline_intelligence_view_count",
      "crm_action_proposal_review_count",
      "crm_follow_up_proposal_review_count",
      "crm_owner_assignment_readiness_view_count",
      "crm_lifecycle_status_readiness_view_count",
      "crm_audit_coverage_count",
      "blocked_crm_action_count",
    ]);
  });

  it("lists safe metric categories and catalog privacy", () => {
    expect(listAnalyticsMetricCategories()).toContain("operational");
    expect(listAnalyticsMetricCategories()).toContain("sla_readiness");

    expect(listAnalyticsMetricCatalog()).toContainEqual(
      expect.objectContaining({
        metricKey: "conversation_total",
        implementationStatus: "foundation_ready",
        privacy: expect.objectContaining({
          aggregated: true,
          rawPayloadIncluded: false,
          rawCustomerMessagesIncluded: false,
        }),
      }),
    );
  });
});
