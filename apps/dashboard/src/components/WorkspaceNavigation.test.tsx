import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WorkspaceNavigation } from "./WorkspaceNavigation";

describe("WorkspaceNavigation", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders owner administration navigation", () => {
    render(<WorkspaceNavigation role="owner" />);

    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("Oversight")).toBeInTheDocument();
    expect(screen.getByText("Administration")).toBeInTheDocument();
    expect(screen.getByText("Queue / Chat Masuk")).toBeInTheDocument();
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

  it("hides administration from agent role", () => {
    render(<WorkspaceNavigation role="agent" />);

    expect(screen.getByText("Follow-up / Action Center")).toBeInTheDocument();
    expect(screen.queryByText("Administration")).not.toBeInTheDocument();
    expect(screen.queryByText("Access Control")).not.toBeInTheDocument();
  });

  it("keeps viewer navigation read-only", () => {
    render(<WorkspaceNavigation role="viewer" />);

    expect(screen.getByText("Workspace / Beranda")).toBeInTheDocument();
    expect(screen.getByText("Queue / Chat Masuk")).toBeInTheDocument();
    expect(
      screen.queryByText("Follow-up / Action Center"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Access Control")).not.toBeInTheDocument();
  });

  it("marks the current workspace item and planned items safely", () => {
    render(<WorkspaceNavigation activeItemId="queue" role="owner" />);

    expect(screen.getByRole("button", { current: "page" })).toHaveTextContent(
      "Queue / Chat Masuk",
    );
    expect(screen.getAllByText("planned").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /CRM \/ Leads/ })).toBeDisabled();
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Workspace navigation",
    );
  });
});
