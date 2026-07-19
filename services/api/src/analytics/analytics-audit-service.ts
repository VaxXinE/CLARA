import type { AuthContext } from "../auth/auth-context";
import type {
  AnalyticsAuditEvent,
  AnalyticsAuditEventName,
} from "./analytics-audit-event-types";
import type { AnalyticsReportingFilters } from "./analytics-reporting-filter-types";
import { toSafeFilterSummary } from "./analytics-safe-filter-summary";

export class AnalyticsAuditService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  record(input: {
    eventName: AnalyticsAuditEventName;
    auth: AuthContext;
    filters: AnalyticsReportingFilters;
    reasonCode?: string;
  }): AnalyticsAuditEvent {
    return {
      eventName: input.eventName,
      workspaceId: input.auth.workspaceId,
      actorId: input.auth.userId,
      timestamp: this.now().toISOString(),
      safeFilterSummary: toSafeFilterSummary(input.filters),
      reasonCode: input.reasonCode ?? "ok",
    };
  }
}
