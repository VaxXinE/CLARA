import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AdminPlaceholderPanel } from "./AdminPlaceholderPanel";

describe("AdminPlaceholderPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders access control, role management, audit, and auth reminders", () => {
    render(<AdminPlaceholderPanel readOnly={false} />);

    expect(screen.getByText("Access Control")).toBeInTheDocument();
    expect(screen.getByText("Role management readiness")).toBeInTheDocument();
    expect(screen.getByText("Audit readiness")).toBeInTheDocument();
    expect(screen.getByText("Production auth reminder")).toBeInTheDocument();
    expect(
      screen.getAllByText("Backend authorization remains the source of truth."),
    ).toHaveLength(4);
  });

  it("keeps access changes disabled", () => {
    render(<AdminPlaceholderPanel readOnly />);

    expect(screen.getByText("read-only")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Access changes disabled" }),
    ).toBeDisabled();
  });
});
