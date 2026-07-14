import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceAccessRequiredPanel } from "./WorkspaceAccessRequiredPanel";

describe("WorkspaceAccessRequiredPanel", () => {
  it("renders a safe blocked state and keeps sign out available", async () => {
    const onSignOut = vi.fn();

    render(
      <WorkspaceAccessRequiredPanel
        message="You do not have access to this workspace."
        onSignOut={onSignOut}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Workspace access required" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/active workspace membership/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Sign Out" }));

    expect(onSignOut).toHaveBeenCalledTimes(1);
    expect(document.body.textContent).not.toContain("access_token");
    expect(document.body.textContent).not.toContain("refresh_token");
    expect(document.body.textContent).not.toContain("Authorization");
    expect(document.body.textContent).not.toContain("raw_provider_payload");
  });
});
