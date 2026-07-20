import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SessionPolicyReadinessResponse } from "../api/types";
import { SessionPolicyReadinessPanel } from "./SessionPolicyReadinessPanel";

const readiness: SessionPolicyReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p10",
  sessionPolicy: {
    secureCookieRequired: true,
    tokenStorageBoundaryRequired: true,
    sessionTimeoutPolicyDefined: true,
    idleTimeoutPolicyDefined: true,
    refreshTokenRotationPolicyDefined: true,
    revocationReadinessDefined: true,
    forceLogoutImplemented: false,
    sessionRevocationImplemented: false,
    mfaStepUpImplemented: false,
  },
  controls: [
    {
      controlKey: "token_storage_boundary",
      label: "Token storage boundary",
      description: "Provider SDK owns session storage.",
      status: "ready",
      severity: "critical",
    },
  ],
  safety: {
    readOnly: true,
    mutationAllowed: false,
    sessionRevoked: false,
    forceLogoutExecuted: false,
    tokensIncluded: false,
    cookiesIncluded: false,
    authHeadersIncluded: false,
    secretsIncluded: false,
  },
};

describe("SessionPolicyReadinessPanel", () => {
  it("renders session policy readiness without revocation actions", () => {
    render(
      <SessionPolicyReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Session Policy Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Token storage boundary")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText(/refresh token/i)).not.toBeInTheDocument();
  });
});
