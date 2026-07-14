import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import source from "./LoginPanel.tsx?raw";
import { LoginPanel } from "./LoginPanel";

describe("LoginPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders explicit provider login copy without token values", () => {
    render(<LoginPanel loading={false} error={null} onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Sign in to CLARA" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/No product data is loaded/)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("access_token");
    expect(document.body.textContent).not.toContain("refresh_token");
    expect(document.body.textContent).not.toContain("Authorization");
  });

  it("submits email and password through the auth abstraction", async () => {
    const onSubmit = vi.fn(async () => {});

    render(<LoginPanel loading={false} error={null} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Email"), "agent@example.test");
    await userEvent.type(screen.getByLabelText("Password"), "pw");
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "agent@example.test",
      password: "pw",
    });
  });

  it("does not use unsafe rendering or privileged key patterns", () => {
    const unsafeHtmlApi = ["dangerously", "Set", "Inner", "HTML"].join("");
    const privilegedKeyName = ["service", "role"].join("_");

    expect(source).not.toContain(unsafeHtmlApi);
    expect(source).not.toContain(privilegedKeyName);
  });
});
