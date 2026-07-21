import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BillingPlanEntitlementReadinessPanel } from "./BillingPlanEntitlementReadinessPanel";

describe("P11 billing plan entitlement dashboard security", () => {
  it("renders plain read-only readiness without unsafe billing controls", () => {
    const { container } = render(<BillingPlanEntitlementReadinessPanel />);
    const text = container.textContent ?? "";

    expect(container.querySelector("[dangerouslySetInnerHTML]")).toBeNull();
    expect(container.querySelector("button")).toBeNull();
    expect(text).not.toContain("access_token");
    expect(text).not.toContain("refresh_token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("client_secret");
    expect(text).not.toContain("raw provider payload");
    expect(text).not.toContain("raw usage events");
  });
});
