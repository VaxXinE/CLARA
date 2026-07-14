import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { InsightWorkspacePanel } from "./InsightWorkspacePanel";

describe("InsightWorkspacePanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders manager insights, knowledge, KPI, and coaching placeholders", () => {
    render(<InsightWorkspacePanel />);

    expect(screen.getByText("Manager Insights")).toBeInTheDocument();
    expect(screen.getByText("Knowledge")).toBeInTheDocument();
    expect(screen.getByText("KPI")).toBeInTheDocument();
    expect(screen.getByText("Coaching readiness")).toBeInTheDocument();
    expect(screen.getByText("planned")).toBeInTheDocument();
  });
});
