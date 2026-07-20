import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SessionPolicyReadinessPanel } from "./SessionPolicyReadinessPanel";

describe("P10 session policy dashboard boundary", () => {
  it("keeps session policy readiness display-only and free of token material", () => {
    const { container } = render(
      <SessionPolicyReadinessPanel
        readiness={null}
        loading={false}
        error={null}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/Revoke Session|Force Logout/i);
    expect(container.textContent).not.toMatch(/access token|refresh token/i);
    expect(container.textContent).not.toMatch(/client secret|cookies/i);
  });
});
