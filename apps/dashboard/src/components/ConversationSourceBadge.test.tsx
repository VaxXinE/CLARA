import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConversationSourceBadge } from "./ConversationSourceBadge";

describe("ConversationSourceBadge", () => {
  it("renders email and gmail sources", () => {
    render(<ConversationSourceBadge source="email" provider="gmail" />);

    expect(screen.getByText("Gmail")).toBeInTheDocument();
  });

  it("handles missing and unknown sources safely", () => {
    const { rerender } = render(<ConversationSourceBadge />);

    expect(screen.getByText("Unknown source")).toBeInTheDocument();

    rerender(<ConversationSourceBadge source="custom_channel" />);

    expect(screen.getByText("custom channel")).toBeInTheDocument();
  });
});
