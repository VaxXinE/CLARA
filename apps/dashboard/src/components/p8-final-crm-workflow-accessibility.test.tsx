import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CrmActivityAuditReadinessPanel } from "./CrmActivityAuditReadinessPanel";

describe("P8 final CRM workflow accessibility", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps the final audit panel reachable by semantic region label", () => {
    render(<CrmActivityAuditReadinessPanel />);

    expect(
      screen.getByRole("region", { name: "CRM activity audit readiness" }),
    ).toBeInTheDocument();
  });
});
