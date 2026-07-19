import {
  analyticsAuditEventNames,
  type AnalyticsAuditEventName,
} from "./analytics-audit-event-types";

export function isAllowedAnalyticsAuditEventName(
  value: string,
): value is AnalyticsAuditEventName {
  return analyticsAuditEventNames.includes(value as AnalyticsAuditEventName);
}
