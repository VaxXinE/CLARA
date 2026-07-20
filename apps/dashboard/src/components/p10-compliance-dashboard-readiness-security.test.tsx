import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComplianceDashboardReadinessPanel } from "./ComplianceDashboardReadinessPanel";

describe("P10 compliance dashboard display boundary", () => {
  it("does not expose raw evidence or add export actions", () => {
    const { container } = render(
      <ComplianceDashboardReadinessPanel
        readiness={null}
        loading={false}
        error={null}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/Export|Download/i);
    expect(container.textContent).not.toMatch(/access token|refresh token/i);
    expect(container.textContent).not.toMatch(/raw provider payload/i);
  });
});
