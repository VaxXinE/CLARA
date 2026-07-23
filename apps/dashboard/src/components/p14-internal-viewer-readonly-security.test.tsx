import { describe, expect, it } from "vitest";
import appSource from "../App.tsx?raw";
import workspaceSource from "./ConversationWorkspace.tsx?raw";
import userRolePanelSource from "./UserRoleManagementReadinessPanel.tsx?raw";

describe("P14 internal viewer readonly security", () => {
  it("does not render raw secrets or unsafe HTML in internal access surfaces", () => {
    const source = `${appSource}\n${workspaceSource}\n${userRolePanelSource}`;

    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/access_token|refresh_token|Authorization/);
    expect(source).not.toMatch(/rawProviderPayload|rawWebhookPayload|rawHtml/);
    expect(source).not.toMatch(/inviteUser|updateRole|deleteUser/);
  });
});
