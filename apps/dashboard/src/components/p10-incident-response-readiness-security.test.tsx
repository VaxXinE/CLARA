import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IncidentResponseReadinessPanel } from "./IncidentResponseReadinessPanel";

describe("P10 incident response readiness dashboard security", () => {
  it("does not render automation controls", () => {
    render(
      <IncidentResponseReadinessPanel
        readiness={null}
        loading={false}
        error={null}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    for (const forbidden of [
      /create incident/i,
      /escalate incident/i,
      /send notification/i,
      /legal hold/i,
    ]) {
      expect(screen.queryByText(forbidden)).not.toBeInTheDocument();
    }
  });
});
