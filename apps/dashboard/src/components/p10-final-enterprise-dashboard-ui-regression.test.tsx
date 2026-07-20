import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EnterpriseComplianceReadinessPanel } from "./EnterpriseComplianceReadinessPanel";

describe("P10 final enterprise dashboard UI regression", () => {
  it("renders a read-only fallback without requiring mutation props", () => {
    render(<EnterpriseComplianceReadinessPanel />);

    expect(screen.getByText("Enterprise Compliance Readiness")).toBeVisible();
    expect(screen.getByText("Read-only")).toBeVisible();
    expect(
      screen.getAllByText("Compliance readiness only.").length,
    ).toBeGreaterThan(0);
  });
});
