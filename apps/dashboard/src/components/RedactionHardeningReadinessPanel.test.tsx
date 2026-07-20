import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RedactionHardeningReadinessResponse } from "../api/types";
import { RedactionHardeningReadinessPanel } from "./RedactionHardeningReadinessPanel";

const readiness: RedactionHardeningReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p10",
  redaction: {
    tokenRedactionRequired: true,
    cookieRedactionRequired: true,
    authHeaderRedactionRequired: true,
    apiKeyRedactionRequired: true,
    providerPayloadRedactionRequired: true,
    webhookPayloadRedactionRequired: true,
    auditMetadataRedactionRequired: true,
    customerMessageRedactionRequiredForComplianceViews: true,
  },
  classifiers: [
    {
      classifierKey: "credential_fields",
      label: "Credential fields",
      detects: ["token"],
      action: "block",
      severity: "critical",
    },
  ],
  safety: {
    readOnly: true,
    mutationAllowed: false,
    rawBeforeAfterSamplesIncluded: false,
    secretsIncluded: false,
  },
};

describe("RedactionHardeningReadinessPanel", () => {
  it("renders redaction hardening readiness safely", () => {
    render(
      <RedactionHardeningReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Redaction Hardening Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Credential fields")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
