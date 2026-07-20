import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QueueJobReliabilityReadinessPanel } from "./QueueJobReliabilityReadinessPanel";

describe("P11 queue job reliability dashboard security", () => {
  it("keeps readiness display read-only and free of worker execution controls", () => {
    const { container } = render(<QueueJobReliabilityReadinessPanel />);

    expect(container.querySelector("button")).toBeNull();
    expect(container.textContent).toContain("No worker execution");
    expect(container.textContent).toContain("no job enqueue");
    expect(container.textContent).toContain("no retry execution");
    expect(container.textContent).toContain("no replay");
    expect(container.textContent).toContain("no purge");
    expect(container.innerHTML).not.toContain("dangerouslySetInnerHTML");
  });
});
