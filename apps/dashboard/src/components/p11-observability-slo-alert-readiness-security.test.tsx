import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ObservabilitySloAlertReadinessPanel } from "./ObservabilitySloAlertReadinessPanel";

describe("P11 observability SLO alert dashboard security", () => {
  it("renders plain read-only readiness without unsafe controls", () => {
    const { container } = render(<ObservabilitySloAlertReadinessPanel />);
    const text = container.textContent ?? "";

    expect(container.querySelector("[dangerouslySetInnerHTML]")).toBeNull();
    expect(container.querySelector("button")).toBeNull();
    expect(text).not.toContain("access token");
    expect(text).not.toContain("refresh token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("raw logs");
    expect(text).not.toContain("raw traces");
    expect(text).not.toContain("raw metric events");
    expect(text).not.toContain("client secret");
  });
});
