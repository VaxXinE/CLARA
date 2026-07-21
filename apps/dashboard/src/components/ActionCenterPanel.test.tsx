import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ActionCenterPanel } from "./ActionCenterPanel";

describe("ActionCenterPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders follow-up, notifications, approvals, and chat review placeholders", () => {
    render(<ActionCenterPanel readOnly={false} />);

    expect(screen.getByText("Follow-up queue")).toBeInTheDocument();
    expect(screen.getByText("Action center")).toBeInTheDocument();
    expect(
      screen.getByText("Notifications / Alert Center"),
    ).toBeInTheDocument();
    expect(screen.getByText("Approvals / Chat Review")).toBeInTheDocument();
    expect(screen.getByText("planned")).toBeInTheDocument();
  });

  it("keeps actions disabled in read-only mode", () => {
    render(<ActionCenterPanel readOnly />);

    expect(screen.getByText("read-only")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Planned action only" }),
    ).toBeDisabled();
    expect(
      screen.getByText(/intentionally disabled before P12/i),
    ).toBeInTheDocument();
  });
});
