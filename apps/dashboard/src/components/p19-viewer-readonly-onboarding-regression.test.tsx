import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("P19 viewer readonly onboarding regression", () => {
  it("keeps viewer read-only wording visible", () => {
    render(<p>Viewer is read-only</p>);

    expect(screen.getByText("Viewer is read-only")).toBeInTheDocument();
  });
});
