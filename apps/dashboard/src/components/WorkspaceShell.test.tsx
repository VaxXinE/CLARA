import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import appSource from "../App.tsx?raw";
import navigationSource from "./WorkspaceNavigation.tsx?raw";
import shellSource from "./WorkspaceShell.tsx?raw";
import { WorkspaceShell } from "./WorkspaceShell";

describe("WorkspaceShell", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders sidebar, topbar, main landmark, and children", () => {
    render(
      <WorkspaceShell
        title="Conversation workspace"
        authSlot={<span>Demo auth</span>}
        metaSlot={<span>Workspace: demo</span>}
      >
        <section>Current dashboard content</section>
      </WorkspaceShell>,
    );

    expect(screen.getByText("CLARA v2")).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skip to workspace content" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent(
      "Current dashboard content",
    );
  });

  it("exposes an accessible mobile menu toggle", async () => {
    render(
      <WorkspaceShell title="Conversation workspace">
        <section>Workspace content</section>
      </WorkspaceShell>,
    );

    const menuButton = screen.getByRole("button", {
      name: "Open workspace navigation",
    });

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("main")).toHaveAttribute("id", "workspace-main");
  });

  it("does not use unsafe HTML or token display patterns", () => {
    const combinedSource = `${shellSource}\n${navigationSource}\n${appSource}`;
    const serviceRole = ["service", "role"].join("_");
    const unsafeHtmlApi = ["dangerously", "Set", "Inner", "HTML"].join("");
    const unsafeProviderBody = ["raw", "provider", "payload"].join(" ");

    expect(combinedSource).not.toContain(unsafeHtmlApi);
    expect(combinedSource).not.toContain(serviceRole);
    expect(combinedSource.toLowerCase()).not.toContain("cookie");
    expect(combinedSource.toLowerCase()).not.toContain(unsafeProviderBody);
  });
});
