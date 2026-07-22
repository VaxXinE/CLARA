import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceNavigation } from "./WorkspaceNavigation";

describe("P12 dashboard Beta / GA UI regression", () => {
  it("keeps release-readiness navigation visible without adding launch controls", () => {
    render(<WorkspaceNavigation activeItemId="workspace" role="owner" />);

    expect(screen.getByText("Workspace / Beranda")).toBeInTheDocument();
    expect(screen.getByText("Queue / Chat Masuk")).toBeInTheDocument();
    expect(screen.queryByText("Launch GA")).not.toBeInTheDocument();
    expect(screen.queryByText("Deploy Production")).not.toBeInTheDocument();
    expect(screen.queryByText("Charge Customer")).not.toBeInTheDocument();
  });
});
