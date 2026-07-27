import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { UserRoleManagementReadinessPanel } from "./UserRoleManagementReadinessPanel";

describe("P19 internal team access guidance", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows owner access guidance without exposing secrets", () => {
    const { container } = render(
      <UserRoleManagementReadinessPanel
        currentRole="owner"
        readiness={{
          status: "readiness_only",
          workspace_id: "wks_real_internal",
          current_user: {
            id: "usr_real_owner",
            role: "owner",
          },
          policy: {
            role: "owner",
            can_read_members: true,
            can_read_readiness: true,
            can_invite_users: false,
            can_update_roles: false,
            can_delete_users: false,
            mutation_status: "not_implemented",
          },
          disabled_controls: ["invite_user", "update_role", "delete_user"],
          message: "Backend authorization remains the source of truth.",
        }}
        members={[
          {
            user_id: "usr_real_owner",
            display_name: "Real Owner",
            email: "owner@example.test",
            role: "owner",
            status: "active",
            created_at: "2026-01-01T00:00:00.000Z",
            updated_at: "2026-01-01T00:00:00.000Z",
          },
        ]}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Real Owner")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invite user disabled" })).toBeDisabled();

    const text = container.textContent ?? "";
    expect(text).not.toContain("access_token");
    expect(text).not.toContain("refresh_token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("raw provider");
    expect(text).not.toContain(["client", "secret"].join("_"));
  });
});
