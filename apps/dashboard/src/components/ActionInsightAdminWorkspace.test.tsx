import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import workspaceSource from "./ActionInsightAdminWorkspace.tsx?raw";
import { ActionInsightAdminWorkspace } from "./ActionInsightAdminWorkspace";

describe("ActionInsightAdminWorkspace", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders action, insight, and admin placeholder sections", () => {
    render(<ActionInsightAdminWorkspace readOnly={false} />);

    expect(
      screen.getByRole("region", {
        name: "Action insight and admin workspace",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Follow-up workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Insight workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Access workspace preview")).toBeInTheDocument();
    expect(screen.getAllByText("planned").length).toBeGreaterThan(0);
  });

  it("does not render enabled mutation controls", () => {
    render(<ActionInsightAdminWorkspace readOnly />);

    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
  });

  it("does not use unsafe rendering or token display patterns", () => {
    const unsafeHtmlApi = ["dangerously", "Set", "Inner", "HTML"].join("");
    const accessToken = ["access", "token"].join("_");

    expect(workspaceSource).not.toContain(unsafeHtmlApi);
    expect(workspaceSource).not.toContain(accessToken);
    expect(workspaceSource).not.toContain("Authorization");
  });
});
