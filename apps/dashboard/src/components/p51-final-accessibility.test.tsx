import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ActionInsightAdminWorkspace } from "./ActionInsightAdminWorkspace";
import { WorkspaceNavigation } from "./WorkspaceNavigation";
import { WorkspaceShell } from "./WorkspaceShell";

describe("P5.1 final accessibility baseline", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps semantic shell landmarks and mobile navigation state", async () => {
    render(
      <WorkspaceShell title="Conversation workspace">
        <section aria-label="Dashboard region">
          <h2>Dashboard content</h2>
        </section>
      </WorkspaceShell>,
    );

    const toggle = screen.getByRole("button", {
      name: "Open workspace navigation",
    });

    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Skip to workspace content" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Workspace navigation",
    );
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps primary sections discoverable by headings and labels", () => {
    render(
      <>
        <WorkspaceNavigation role="owner" />
        <ActionInsightAdminWorkspace readOnly />
      </>,
    );

    expect(
      screen.getByRole("heading", { name: "Workspace" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Oversight" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", {
        name: "Action insight and admin workspace",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Follow-up workspace preview" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Insight workspace preview" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Access workspace preview" }),
    ).toBeInTheDocument();
  });

  it("keeps placeholder controls disabled with accessible names", () => {
    render(<ActionInsightAdminWorkspace readOnly />);

    expect(
      screen.getByRole("button", { name: "Planned action only" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Access changes disabled" }),
    ).toBeDisabled();
    expect(screen.getAllByText("read-only").length).toBeGreaterThan(0);
  });
});
