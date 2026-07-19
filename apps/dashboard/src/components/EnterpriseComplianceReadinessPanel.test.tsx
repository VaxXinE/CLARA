import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EnterpriseComplianceReadinessPanel } from "./EnterpriseComplianceReadinessPanel";

describe("EnterpriseComplianceReadinessPanel", () => {
  it("renders P10 readiness categories as read-only compliance readiness", () => {
    render(<EnterpriseComplianceReadinessPanel />);

    expect(
      screen.getByRole("region", { name: "Enterprise Compliance Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Tenant isolation")).toBeInTheDocument();
    expect(screen.getByText("Access control")).toBeInTheDocument();
    expect(screen.getByText("Data classification")).toBeInTheDocument();
    expect(screen.getByText("Audit readiness")).toBeInTheDocument();
    expect(screen.getByText("Retention readiness")).toBeInTheDocument();
    expect(screen.getByText("Incident response readiness")).toBeInTheDocument();
    expect(screen.getByText("Evidence readiness")).toBeInTheDocument();
    expect(screen.queryByText("Export")).not.toBeInTheDocument();
    expect(screen.queryByText("Send Message")).not.toBeInTheDocument();
  });
});
