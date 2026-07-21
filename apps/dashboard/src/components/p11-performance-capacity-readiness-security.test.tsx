import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PerformanceCapacityReadinessPanel } from "./PerformanceCapacityReadinessPanel";

describe("P11 performance capacity dashboard security", () => {
  it("renders fallback readiness without sensitive data or mutation controls", () => {
    const { container } = render(<PerformanceCapacityReadinessPanel />);
    const text = container.textContent ?? "";

    expect(text).toContain("Read-only performance and capacity readiness");
    expect(text).not.toContain("access_token");
    expect(text).not.toContain("refresh_token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("client_secret");
    expect(text).not.toContain("raw metric events");
    expect(text).not.toContain("raw customer messages");
    expect(text).not.toContain("Run Stress Test");
    expect(container.querySelector("button")).toBeNull();
  });
});
