import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceNavigation } from "./WorkspaceNavigation";

describe("P12 RC smoke readiness UI regression", () => {
  it("keeps dashboard navigable without release launch controls", () => {
    render(<WorkspaceNavigation activeItemId="workspace" role="owner" />);

    expect(screen.getByText("Workspace / Beranda")).toBeInTheDocument();
    expect(screen.getByText("Queue / Chat Masuk")).toBeInTheDocument();
    expect(
      screen.queryByText("Release Candidate Launch"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Deploy Production")).not.toBeInTheDocument();
    expect(screen.queryByText("Activate Billing")).not.toBeInTheDocument();
  });
});
