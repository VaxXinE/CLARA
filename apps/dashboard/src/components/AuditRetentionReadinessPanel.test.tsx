import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AuditRetentionReadinessResponse } from "../api/types";
import { AuditRetentionReadinessPanel } from "./AuditRetentionReadinessPanel";

const readiness: AuditRetentionReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p10",
  retentionReadiness: {
    auditRetentionPolicyDefined: true,
    safeAuditMetadataOnly: true,
    rawSecretsProhibited: true,
    rawProviderPayloadProhibited: true,
    rawWebhookPayloadProhibited: true,
    deletionAutomationImplemented: false,
    legalHoldAutomationImplemented: false,
    retentionJobImplemented: false,
    exportImplemented: false,
  },
  categories: [
    {
      categoryKey: "audit_events",
      label: "Audit events",
      description: "Safe metadata only.",
      retentionIntent: "retain_for_audit",
      dataClassification: "restricted",
      rawSensitiveDataAllowed: false,
      redactionRequired: true,
    },
  ],
  safety: {
    readOnly: true,
    mutationAllowed: false,
    deletionExecuted: false,
    legalHoldExecuted: false,
    exportExecuted: false,
    rawAuditMetadataIncluded: false,
    secretsIncluded: false,
  },
};

describe("AuditRetentionReadinessPanel", () => {
  it("renders audit retention readiness as compliance readiness only", () => {
    render(
      <AuditRetentionReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Audit Retention Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Audit events")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText(/not certification/i)).toBeInTheDocument();
  });
});
