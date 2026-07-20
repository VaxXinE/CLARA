import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EvidenceReadinessPanel } from "./EvidenceReadinessPanel";

describe("P10 evidence readiness dashboard security", () => {
  it("does not render export, download, or token data", () => {
    render(
      <EvidenceReadinessPanel readiness={null} loading={false} error={null} />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    for (const forbidden of [/download/i, /access token/i, /client secret/i]) {
      expect(screen.queryByText(forbidden)).not.toBeInTheDocument();
    }
  });
});
