import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TenantIsolationReadinessResponse } from "../api/types";
import { TenantIsolationReadinessPanel } from "./TenantIsolationReadinessPanel";

const readiness: TenantIsolationReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p10",
  readiness: {
    backendAuthContextSourceOfTruth: true,
    clientWorkspaceIdAuthoritative: false,
    workspaceScopedReadsRequired: true,
    workspaceScopedWritesRequired: true,
    crossWorkspaceAccessDenied: true,
    safeErrorBehaviorRequired: true,
    auditOnBoundaryViolationRequired: true,
    dashboardUxBoundaryRequired: true,
    extensionBoundaryRequired: true,
  },
  checks: [
    {
      checkKey: "workspace_scope",
      label: "Workspace scope",
      description: "Queries remain scoped by backend workspace context.",
      status: "ready",
      severity: "critical",
      evidenceType: "runtime_guardrail",
    },
  ],
  safety: {
    readOnly: true,
    mutationAllowed: false,
    rawTenantDataIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    rawAuditMetadataIncluded: false,
    secretsIncluded: false,
  },
};

describe("TenantIsolationReadinessPanel", () => {
  it("renders safe tenant isolation readiness", () => {
    render(
      <TenantIsolationReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Tenant Isolation Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Workspace scope")).toBeInTheDocument();
    expect(screen.getByText(/backend AuthContext/i)).toBeInTheDocument();
  });
});
