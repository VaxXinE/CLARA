import { describe, expect, it } from "vitest";
import { getAdminSecurityControls } from "../src/enterprise/admin-security-controls-policy";

describe("P10 admin security controls policy", () => {
  it("defines backend-owned admin readiness controls", () => {
    const controls = getAdminSecurityControls();

    expect(controls.map((control) => control.controlKey)).toContain(
      "backend_authorization",
    );
    expect(controls.every((control) => control.status !== "blocked")).toBe(
      true,
    );
  });
});
