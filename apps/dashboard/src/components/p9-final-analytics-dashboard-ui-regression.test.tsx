import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type {
  CrmWorkflowMetricsResponse,
  KpiDashboardResponse,
} from "../api/types";
import { AnalyticsDashboardWorkspace } from "./AnalyticsDashboardWorkspace";

const kpiDashboard: KpiDashboardResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T01:00:00.000Z",
  timeWindow: "last_7_days",
  cards: [],
  safety: {
    readOnly: true,
    exportEnabled: false,
    drilldownEnabled: false,
    mutationAllowed: false,
  },
  appliedFilters: {
    timeWindow: "last_7_days",
    channel: "all",
    operatorScoped: false,
  },
  rejectedFilters: [],
  filterSafety: {
    workspaceScoped: true,
    clientWorkspaceIdIgnored: true,
    customerLevelDrilldown: false,
    reportExported: false,
    rawPayloadIncluded: false,
    rawCustomerMessagesIncluded: false,
  },
  audit: {
    eventName: "p9_kpi_dashboard_viewed",
    workspaceId: "wks_demo_sales",
    actorId: "usr_demo_owner",
    timestamp: "2026-07-20T01:00:00.000Z",
    safeFilterSummary: {
      timeWindow: "last_7_days",
      channel: "all",
      category: "all",
      operatorScoped: false,
    },
    reasonCode: "ok",
  },
};

const crmWorkflowMetrics: CrmWorkflowMetricsResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T01:00:00.000Z",
  timeWindow: "last_7_days",
  category: "crm_workflow",
  metrics: [],
  safety: {
    readOnly: true,
    mutationAllowed: false,
    actionExecuted: false,
    crmMutationExecuted: false,
    taskCreated: false,
    customerNoteWritten: false,
    ownerAssigned: false,
    lifecycleStatusUpdated: false,
    outboundSent: false,
    customerLevelDrilldown: false,
    reportExported: false,
  },
};

describe("P9 final analytics dashboard UI regression", () => {
  it("renders KPI, filters, audit privacy, and CRM workflow analytics together", () => {
    render(
      <AnalyticsDashboardWorkspace
        kpiDashboard={kpiDashboard}
        crmWorkflowMetrics={crmWorkflowMetrics}
      />,
    );

    expect(screen.getByText("Reporting Filters")).toBeInTheDocument();
    expect(screen.getByText("Analytics Audit Privacy")).toBeInTheDocument();
    expect(screen.getByText("KPI Dashboard Cards")).toBeInTheDocument();
    expect(screen.getByText("CRM Workflow Metrics")).toBeInTheDocument();
  });
});
