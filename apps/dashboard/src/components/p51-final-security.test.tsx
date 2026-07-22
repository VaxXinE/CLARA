import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import appSource from "../App.tsx?raw";
import clientSource from "../api/client.ts?raw";
import authProviderSource from "../auth/AuthProvider.tsx?raw";
import actionWorkspaceSource from "./ActionInsightAdminWorkspace.tsx?raw";
import composerSource from "./ComposerPanel.tsx?raw";
import conversationWorkspaceSource from "./ConversationWorkspace.tsx?raw";
import crmWorkspaceSource from "./CrmCustomerWorkspace.tsx?raw";
import navigationSource from "./WorkspaceNavigation.tsx?raw";
import shellSource from "./WorkspaceShell.tsx?raw";
import { ActionInsightAdminWorkspace } from "./ActionInsightAdminWorkspace";
import { ComposerPanel } from "./ComposerPanel";

const dashboardSource = [
  appSource,
  clientSource,
  authProviderSource,
  shellSource,
  navigationSource,
  conversationWorkspaceSource,
  composerSource,
  crmWorkspaceSource,
  actionWorkspaceSource,
].join("\n");

describe("P5.1 final security guardrails", () => {
  afterEach(() => {
    cleanup();
  });

  it("does not use unsafe HTML or display provider secret material", () => {
    const unsafeHtmlApi = ["dangerously", "Set", "Inner", "HTML"].join("");
    const serviceRole = ["service", "role"].join("_");
    const accessToken = ["access", "token"].join("_");
    const refreshToken = ["refresh", "token"].join("_");
    const clientSecret = ["client", "secret"].join("_");
    const apiKey = ["api", "key"].join("_");

    expect(dashboardSource).not.toContain(unsafeHtmlApi);
    expect(dashboardSource).not.toContain(serviceRole);
    expect(dashboardSource).not.toContain(accessToken);
    expect(dashboardSource).not.toContain(refreshToken);
    expect(dashboardSource).not.toContain(clientSecret);
    expect(dashboardSource).not.toContain(apiKey);
    expect(dashboardSource.toLowerCase()).not.toContain("raw provider payload");
  });

  it("does not introduce placeholder mutation handlers", () => {
    const forbiddenHandlers = [
      "approveConversation",
      "publishKnowledge",
      "createFollowUp",
      "updateRole",
      "deleteUser",
      "assignOwner",
      "sendNotification",
      "updateAccess",
      "deleteAudit",
      "createKpi",
      "updateKpi",
      "updateLead",
      "deleteLead",
      "mergeCustomer",
      "deleteCustomer",
    ];

    for (const handler of forbiddenHandlers) {
      expect(dashboardSource).not.toContain(handler);
    }
  });

  it("keeps AI draft visible as draft and reply send human-triggered", () => {
    render(
      <ComposerPanel
        value="Draft response"
        onChange={() => {}}
        onGenerateDraft={() => {}}
        onSendReply={() => {}}
        canGenerateDraft
        canSendReply
        isGeneratingDraft={false}
        isSendingReply={false}
        error={null}
        aiDraftLabel="AI-assisted draft - Review before sending"
        readOnlyMessage={null}
      />,
    );

    expect(screen.getAllByText(/AI-assisted draft/).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: "Generate AI Draft" }),
    ).toBeEnabled();
    expect(screen.getByRole("button", { name: "Send Reply" })).toBeEnabled();
    expect(composerSource).toContain("onSendReply");
  });

  it("keeps placeholder write controls disabled for read-only surfaces", () => {
    render(<ActionInsightAdminWorkspace readOnly />);

    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
  });
});
