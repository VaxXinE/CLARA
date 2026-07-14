import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { UserRoleManagementReadinessPanel } from "./UserRoleManagementReadinessPanel";

const readiness = {
  status: "readiness_only" as const,
  workspace_id: "wks_demo_sales",
  current_user: {
    id: "usr_demo_owner",
    role: "owner",
  },
  policy: {
    role: "owner",
    can_read_members: true,
    can_read_readiness: true,
    can_invite_users: false as const,
    can_update_roles: false as const,
    can_delete_users: false as const,
    mutation_status: "not_implemented" as const,
  },
  disabled_controls: ["invite_user", "update_role", "delete_user"] as [
    "invite_user",
    "update_role",
    "delete_user",
  ],
  message: "Backend authorization remains the source of truth.",
};

describe("UserRoleManagementReadinessPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders backend-derived role readiness and disabled controls", () => {
    render(
      <UserRoleManagementReadinessPanel
        currentRole="owner"
        readiness={readiness}
        members={[
          {
            user_id: "usr_demo_owner",
            display_name: "Owner Demo",
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

    expect(screen.getByText("role: owner")).toBeInTheDocument();
    expect(screen.getByText("Status: readiness_only")).toBeInTheDocument();
    expect(screen.getByText("Owner Demo")).toBeInTheDocument();
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

  it("does not render sensitive provider material", () => {
    const { container } = render(
      <UserRoleManagementReadinessPanel
        currentRole="viewer"
        readiness={null}
        members={[]}
        loading={false}
        error="Access readiness is unavailable."
      />,
    );

    const text = container.textContent ?? "";

    expect(text).not.toContain("access_token");
    expect(text).not.toContain("refresh_token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain(["client", "secret"].join("_"));
    expect(text).not.toContain("raw provider");
  });
});
