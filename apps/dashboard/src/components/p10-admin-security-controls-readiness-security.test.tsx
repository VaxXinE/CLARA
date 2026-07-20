import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminSecurityControlsReadinessPanel } from "./AdminSecurityControlsReadinessPanel";

describe("P10 admin security controls dashboard boundary", () => {
  it("keeps admin security readiness display-only and free of sensitive internals", () => {
    const { container } = render(
      <AdminSecurityControlsReadinessPanel
        readiness={null}
        loading={false}
        error={null}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/Change Role|Grant Permission/i);
    expect(container.textContent).not.toMatch(/access token|refresh token/i);
    expect(container.textContent).not.toMatch(/raw customer messages/i);
  });
});
