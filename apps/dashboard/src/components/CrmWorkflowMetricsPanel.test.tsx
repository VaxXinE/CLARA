import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CrmWorkflowMetricsPanel } from "./CrmWorkflowMetricsPanel";
import type { CrmWorkflowMetricsResponse } from "../api/types";

const metrics: CrmWorkflowMetricsResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T01:00:00.000Z",
  timeWindow: "last_7_days",
  category: "crm_workflow",
  metrics: [
    {
      metricKey: "crm_review_only_action_count",
      label: "Review-only CRM actions",
      description: "CRM workflow actions kept in review-only mode.",
      value: 2,
      valueType: "count",
      aggregationLevel: "workspace",
      implementationStatus: "implemented",
      privacy: {
        aggregated: true,
        rawPayloadIncluded: false,
        rawCustomerMessagesIncluded: false,
        rawProviderPayloadIncluded: false,
        rawWebhookPayloadIncluded: false,
        rawAuditMetadataIncluded: false,
        workspaceScoped: true,
        piiMinimized: true,
        policyVersion: "p9-analytics-kpi-policy-v1",
      },
    },
  ],
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

describe("CrmWorkflowMetricsPanel", () => {
  it("renders aggregate CRM workflow metrics safely", () => {
    render(<CrmWorkflowMetricsPanel metrics={metrics} />);

    expect(screen.getByText("CRM Workflow Metrics")).toBeInTheDocument();
    expect(screen.getByText("Review-only CRM actions: 2")).toBeInTheDocument();
    expect(screen.queryByText("Assign Owner")).not.toBeInTheDocument();
    expect(screen.queryByText("Write Note")).not.toBeInTheDocument();
  });
});
