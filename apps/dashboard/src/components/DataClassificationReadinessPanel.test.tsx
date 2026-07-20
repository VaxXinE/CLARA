import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DataClassificationReadinessResponse } from "../api/types";
import { DataClassificationReadinessPanel } from "./DataClassificationReadinessPanel";

const readiness: DataClassificationReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p10",
  classifications: [
    "public",
    "internal",
    "confidential",
    "restricted",
    "secret",
  ],
  dataClasses: [
    {
      dataClassKey: "credential_material",
      label: "Credential material",
      classification: "secret",
      examples: ["credential reference only"],
      handlingRules: ["Never render", "Never log"],
      redactionRequired: true,
      auditSafe: false,
      dashboardSafe: false,
      extensionSafe: false,
    },
  ],
  safety: {
    readOnly: true,
    rawSensitiveExamplesIncluded: false,
    secretsIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    rawAuditMetadataIncluded: false,
  },
};

describe("DataClassificationReadinessPanel", () => {
  it("renders classification readiness safely", () => {
    render(
      <DataClassificationReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Data Classification Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Credential material")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
