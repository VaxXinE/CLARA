import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceNavigation } from "./WorkspaceNavigation";

describe("P12 deployment readiness UI regression", () => {
  it("keeps deployment readiness out of dashboard mutation navigation", () => {
    render(<WorkspaceNavigation activeItemId="workspace" role="owner" />);

    expect(screen.getByText("Workspace / Beranda")).toBeInTheDocument();
    expect(screen.queryByText("Deploy Production")).not.toBeInTheDocument();
    expect(screen.queryByText("Rollback Production")).not.toBeInTheDocument();
    expect(screen.queryByText("Activate Provider")).not.toBeInTheDocument();
    expect(screen.queryByText("Activate Billing")).not.toBeInTheDocument();
  });
});
