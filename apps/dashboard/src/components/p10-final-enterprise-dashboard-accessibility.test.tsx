import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EnterpriseComplianceReadinessPanel } from "./EnterpriseComplianceReadinessPanel";

describe("P10 final enterprise dashboard accessibility", () => {
  it("keeps the enterprise readiness fallback section labeled", () => {
    render(<EnterpriseComplianceReadinessPanel />);

    expect(
      screen.getByRole("region", {
        name: "Enterprise Compliance Readiness",
      }),
    ).toBeVisible();
  });
});
