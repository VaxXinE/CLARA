import type { AnalyticsMetricCategory } from "./analytics-metric-types";
import type {
  KpiDashboardCard,
  KpiDashboardCardKey,
  KpiDashboardQuery,
  KpiDashboardResponse,
} from "./kpi-dashboard-card-types";

const safety: KpiDashboardResponse["safety"] = {
  readOnly: true,
  exportEnabled: false,
  drilldownEnabled: false,
  mutationAllowed: false,
};

const cardText: Record<
  KpiDashboardCardKey,
  Pick<KpiDashboardCard, "label" | "description" | "category" | "source">
> = {
  total_conversations: {
    label: "Total conversations",
    description: "Aggregate workspace conversation volume.",
    category: "operational",
    source: "core_operational_metrics",
  },
  unresolved_conversations: {
    label: "Unresolved conversations",
    description: "Workspace conversations not closed yet.",
    category: "operational",
    source: "core_operational_metrics",
  },
  sla_risk: {
    label: "SLA risk",
    description: "Conversations at risk of missing response expectations.",
    category: "sla_readiness",
    source: "sla_readiness_metrics",
  },
  channel_health: {
    label: "Channel health",
    description: "Overall channel/provider health.",
    category: "channel_performance",
    source: "channel_performance_metrics",
  },
  crm_workflow_reviews: {
    label: "CRM workflow reviews",
    description: "Review-only CRM workflow proposals surfaced.",
    category: "crm_workflow",
    source: "crm_workflow_metrics",
  },
  crm_audit_coverage: {
    label: "CRM audit coverage",
    description: "Audit-covered CRM workflow readiness events.",
    category: "audit_compliance",
    source: "crm_workflow_metrics",
  },
  blocked_sensitive_actions: {
    label: "Blocked sensitive actions",
    description: "Sensitive CRM workflow actions blocked from automation.",
    category: "audit_compliance",
    source: "crm_workflow_metrics",
  },
  outbound_delivery_health: {
    label: "Outbound delivery health",
    description: "Aggregate outbound delivery status.",
    category: "channel_performance",
    source: "channel_performance_metrics",
  },
};

export function buildKpiDashboardCard(input: {
  cardKey: KpiDashboardCardKey;
  value: number | string;
  valueType: KpiDashboardCard["valueType"];
  severity: KpiDashboardCard["severity"];
}): KpiDashboardCard {
  return {
    cardKey: input.cardKey,
    ...cardText[input.cardKey],
    value: input.value,
    valueType: input.valueType,
    severity: input.severity,
    privacy: {
      aggregated: true,
      workspaceScoped: true,
      rawPayloadIncluded: false,
      rawCustomerMessagesIncluded: false,
      piiMinimized: true,
    },
  };
}

export function buildKpiDashboardResponse(input: {
  workspaceId: string;
  generatedAt: string;
  query: KpiDashboardQuery;
  cards: KpiDashboardCard[];
}): KpiDashboardResponse {
  return {
    workspaceId: input.workspaceId,
    generatedAt: input.generatedAt,
    timeWindow: input.query.timeWindow,
    cards: input.query.category
      ? input.cards.filter(
          (card) =>
            card.category === (input.query.category as AnalyticsMetricCategory),
        )
      : input.cards,
    safety,
  };
}
