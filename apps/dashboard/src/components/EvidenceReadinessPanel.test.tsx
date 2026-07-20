import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { EvidenceReadinessResponse } from "../api/types";
import { EvidenceReadinessPanel } from "./EvidenceReadinessPanel";

const readiness: EvidenceReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p10",
  evidenceReadiness: {
    evidenceCategoriesDefined: true,
    safeEvidenceSummaryOnly: true,
    rawEvidenceBrowsingImplemented: false,
    evidenceExportImplemented: false,
    evidenceDownloadImplemented: false,
    certificationClaimed: false,
    auditTrailLinked: true,
    retentionPolicyLinked: true,
  },
  categories: [
    {
      categoryKey: "policy_evidence",
      label: "Policy evidence",
      description: "Policy summary is defined.",
      classification: "internal",
      evidenceSource: "policy",
      rawEvidenceIncluded: false,
      exportAllowed: false,
    },
  ],
  safety: {
    readOnly: true,
    exportEnabled: false,
    downloadEnabled: false,
    rawEvidenceIncluded: false,
    rawAuditMetadataIncluded: false,
    secretsIncluded: false,
    certificationClaimed: false,
  },
};

describe("EvidenceReadinessPanel", () => {
  it("renders safe evidence readiness without export controls", () => {
    render(
      <EvidenceReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Evidence Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Policy evidence")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText(/refresh token/i)).not.toBeInTheDocument();
  });
});
