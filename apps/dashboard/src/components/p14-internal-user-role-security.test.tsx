import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { UserRoleManagementReadinessPanel } from "./UserRoleManagementReadinessPanel";

describe("P14 internal user role security UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps viewer state safe and does not render secrets or raw payloads", () => {
    const { container } = render(
      <UserRoleManagementReadinessPanel
        currentRole="viewer"
        readiness={null}
        members={[]}
        loading={false}
        error="No member list available for this role."
      />,
    );

    const text = container.textContent ?? "";

    expect(text).toContain("role: viewer");
    expect(text).toContain("No member list available for this role.");
    expect(text).not.toContain("access_token");
    expect(text).not.toContain("refresh_token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain(["client", "secret"].join("_"));
    expect(text).not.toContain("raw_provider_payload");
  });
});
