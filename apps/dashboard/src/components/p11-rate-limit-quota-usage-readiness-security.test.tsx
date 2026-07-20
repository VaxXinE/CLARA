import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RateLimitQuotaUsageReadinessPanel } from "./RateLimitQuotaUsageReadinessPanel";

describe("P11 rate limit quota usage dashboard security", () => {
  it("renders plain read-only readiness without unsafe controls", () => {
    const { container } = render(<RateLimitQuotaUsageReadinessPanel />);
    const text = container.textContent ?? "";

    expect(container.querySelector("[dangerouslySetInnerHTML]")).toBeNull();
    expect(container.querySelector("button")).toBeNull();
    expect(text).not.toContain("access token");
    expect(text).not.toContain("refresh token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("raw usage events");
    expect(text).not.toContain("raw customer messages");
    expect(text).not.toContain("client secret");
  });
});
