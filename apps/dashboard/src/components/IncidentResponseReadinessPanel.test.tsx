import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { IncidentResponseReadinessResponse } from "../api/types";
import { IncidentResponseReadinessPanel } from "./IncidentResponseReadinessPanel";

const readiness: IncidentResponseReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p10",
  incidentResponse: {
    severityModelDefined: true,
    escalationPolicyDefined: true,
    communicationPolicyDefined: true,
    containmentChecklistDefined: true,
    evidencePreservationDefined: true,
    postIncidentReviewDefined: true,
    automatedIncidentExecutionImplemented: false,
    legalHoldAutomationImplemented: false,
    dataDeletionAutomationImplemented: false,
  },
  severityLevels: ["sev1", "sev2", "sev3", "sev4"],
  controls: [
    {
      controlKey: "severity_model",
      label: "Severity model",
      description: "SEV model is defined.",
      status: "ready",
      severity: "critical",
      safeEvidenceSummary: "Summary only.",
    },
  ],
  safety: {
    readOnly: true,
    mutationAllowed: false,
    incidentCreated: false,
    escalationExecuted: false,
    notificationSent: false,
    legalHoldExecuted: false,
    dataDeleted: false,
    rawEvidenceIncluded: false,
    secretsIncluded: false,
  },
};

describe("IncidentResponseReadinessPanel", () => {
  it("renders safe incident response readiness without mutation controls", () => {
    render(
      <IncidentResponseReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Incident Response Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Severity model")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText(/authorization/i)).not.toBeInTheDocument();
  });
});
