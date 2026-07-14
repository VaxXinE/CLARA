import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WorkspaceNavigation } from "./WorkspaceNavigation";

describe("WorkspaceNavigation", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders grouped operator navigation", () => {
    render(<WorkspaceNavigation />);

    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("Oversight")).toBeInTheDocument();
    expect(screen.getByText("Administration")).toBeInTheDocument();
    expect(screen.getByText("Chat Masuk / Queue")).toBeInTheDocument();
    expect(screen.getByText("CRM / Leads")).toBeInTheDocument();
    expect(screen.getByText("Customers")).toBeInTheDocument();
    expect(screen.getByText("Follow-up / Action Center")).toBeInTheDocument();
    expect(
      screen.getByText("Notifications / Alert Center"),
    ).toBeInTheDocument();
    expect(screen.getByText("Approvals / Chat Review")).toBeInTheDocument();
    expect(screen.getByText("Manager Insights")).toBeInTheDocument();
    expect(screen.getByText("Knowledge")).toBeInTheDocument();
    expect(screen.getByText("KPI")).toBeInTheDocument();
    expect(screen.getByText("Access Control")).toBeInTheDocument();
  });

  it("marks the current workspace item and planned items safely", () => {
    render(<WorkspaceNavigation />);

    expect(screen.getByRole("button", { current: "page" })).toHaveTextContent(
      "Beranda / Workspace",
    );
    expect(screen.getAllByText("planned").length).toBeGreaterThan(0);
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Workspace navigation",
    );
  });
});
