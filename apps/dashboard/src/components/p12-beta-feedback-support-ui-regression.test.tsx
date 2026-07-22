import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceNavigation } from "./WorkspaceNavigation";

describe("P12 beta feedback support UI regression", () => {
  it("keeps support workflow out of dashboard mutation navigation", () => {
    render(<WorkspaceNavigation activeItemId="workspace" role="owner" />);

    expect(screen.getByText("Workspace / Beranda")).toBeInTheDocument();
    expect(screen.queryByText("Create Support Ticket")).not.toBeInTheDocument();
    expect(screen.queryByText("Send Feedback")).not.toBeInTheDocument();
    expect(screen.queryByText("Notify Slack")).not.toBeInTheDocument();
    expect(screen.queryByText("Open Zendesk")).not.toBeInTheDocument();
  });
});
