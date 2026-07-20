import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ComplianceDashboardResponse } from "../api/types";
import { ComplianceDashboardReadinessPanel } from "./ComplianceDashboardReadinessPanel";

const readiness: ComplianceDashboardResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p10",
  readinessSummary: {
    enterpriseScopeReady: true,
    tenantIsolationReady: true,
    permissionAuditReady: true,
    auditRetentionReady: true,
    dataClassificationReady: true,
    redactionHardeningReady: true,
    adminSecurityControlsReady: true,
    sessionPolicyReady: true,
    evidenceReadinessImplemented: true,
    incidentResponseImplemented: true,
    backupRestoreImplemented: true,
    finalP10AuditImplemented: true,
  },
  categories: [
    {
      categoryKey: "tenant_permissions",
      label: "Tenant permissions",
      description: "Workspace boundaries are covered by server policy.",
      status: "ready",
      riskLevel: "medium",
      safeEvidenceSummary: "Safe tests and policy docs only.",
    },
  ],
  safety: {
    readOnly: true,
    exportEnabled: false,
    evidenceDownloadEnabled: false,
    rawEvidenceIncluded: false,
    rawAuditMetadataIncluded: false,
    secretsIncluded: false,
    certificationClaimed: false,
  },
};

describe("ComplianceDashboardReadinessPanel", () => {
  it("renders compliance readiness without export or evidence download controls", () => {
    render(
      <ComplianceDashboardReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Compliance Dashboard Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Tenant permissions")).toBeInTheDocument();
    expect(screen.getByText(/not certification/i)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText(/raw audit metadata/i)).not.toBeInTheDocument();
  });
});
