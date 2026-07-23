import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { UserRoleManagementReadinessPanel } from "./UserRoleManagementReadinessPanel";

describe("P14 internal user role setup UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders internal role guidance as readiness-only with disabled mutations", () => {
    render(
      <UserRoleManagementReadinessPanel
        currentRole="owner"
        readiness={{
          status: "readiness_only",
          workspace_id: "wks_demo_sales",
          current_user: {
            id: "usr_demo_owner",
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
        members={[]}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("role: owner")).toBeInTheDocument();
    expect(screen.getByText("Status: readiness_only")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Invite user disabled" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Update role disabled" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Remove member disabled" }),
    ).toBeDisabled();
  });
});
