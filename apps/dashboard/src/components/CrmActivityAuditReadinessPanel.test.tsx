import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CrmActivityAuditReadinessPanel } from "./CrmActivityAuditReadinessPanel";

describe("CrmActivityAuditReadinessPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders audit-only CRM coverage without mutation controls", () => {
    render(<CrmActivityAuditReadinessPanel />);

    expect(screen.getByText("CRM activity audit")).toBeInTheDocument();
    expect(screen.getByText("audit-only")).toBeInTheDocument();
    expect(screen.getByText("profile intelligence")).toBeInTheDocument();
    expect(screen.getByText("lifecycle/status readiness")).toBeInTheDocument();
    expect(screen.getByText(/mutationExecuted=false/)).toBeInTheDocument();
    expect(screen.getByText(/actionExecuted=false/)).toBeInTheDocument();
    expect(screen.getByText(/reviewOnly=true/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render sensitive audit internals", () => {
    const { container } = render(<CrmActivityAuditReadinessPanel />);
    const html = container.innerHTML;

    for (const value of [
      "access_token",
      "refresh_token",
      "Authorization",
      "raw provider payload",
      "raw webhook payload",
      "raw DOM",
      "raw HTML",
      "raw prompt",
      "client_secret",
      "<script",
    ]) {
      expect(html).not.toContain(value);
    }
  });
});
