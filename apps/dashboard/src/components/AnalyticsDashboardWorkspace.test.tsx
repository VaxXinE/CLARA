import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalyticsDashboardWorkspace } from "./AnalyticsDashboardWorkspace";
import type {
  CrmWorkflowMetricsResponse,
  KpiDashboardResponse,
} from "../api/types";

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

describe("AnalyticsDashboardWorkspace", () => {
  it("renders KPI and CRM workflow panels together", () => {
    render(
      <AnalyticsDashboardWorkspace
        kpiDashboard={kpiDashboard}
        crmWorkflowMetrics={crmWorkflowMetrics}
      />,
    );

    expect(screen.getByText("KPI Dashboard Cards")).toBeInTheDocument();
    expect(screen.getByText("CRM Workflow Metrics")).toBeInTheDocument();
  });
});
