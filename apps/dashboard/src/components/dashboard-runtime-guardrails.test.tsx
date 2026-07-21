import appSource from "../App.tsx?raw";
import navigationSource from "./WorkspaceNavigation.tsx?raw";
import shellSource from "./WorkspaceShell.tsx?raw";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConversationWorkspace } from "./ConversationWorkspace";

const runtimeSources = import.meta.glob(
  ["./*.ts", "./*.tsx", "../*.ts", "../*.tsx"],
  {
    eager: true,
    query: "?raw",
    import: "default",
  },
) as Record<string, string>;

const sourceFiles = Object.entries(runtimeSources)
  .filter(([path]) => !path.includes(".test."))
  .map(([, source]) => source)
  .join("\n");

describe("dashboard runtime guardrails", () => {
  it("does not introduce unsafe HTML rendering primitives", () => {
    expect(sourceFiles).not.toContain("dangerouslySetInnerHTML");
    expect(sourceFiles).not.toContain(".innerHTML");
  });

  it("does not expose unsafe launch actions in dashboard UI", () => {
    render(
      <ConversationWorkspace
        scheduler={{
          status: {
            scheduler_enabled: true,
            scheduler_running: true,
            interval_ms: 300000,
            max_accounts_per_tick: 5,
            max_messages_per_account: 20,
            last_tick_status: "completed",
          },
          loading: false,
          error: null,
        }}
        tenantIsolation={{ readiness: null, loading: false, error: null }}
        permissionAudit={{ readiness: null, loading: false, error: null }}
        auditRetention={{ readiness: null, loading: false, error: null }}
        dataClassification={{ readiness: null, loading: false, error: null }}
        redactionHardening={{ readiness: null, loading: false, error: null }}
        enterpriseCompliance={{
          adminSecurityControls: {
            readiness: null,
            loading: false,
            error: null,
          },
          sessionPolicy: { readiness: null, loading: false, error: null },
          complianceDashboard: { readiness: null, loading: false, error: null },
          backupRestore: { readiness: null, loading: false, error: null },
          incidentResponse: { readiness: null, loading: false, error: null },
          evidence: { readiness: null, loading: false, error: null },
        }}
        channelHealth={{ items: [], loading: false, error: null }}
        inbox={{
          conversations: [],
          selectedConversationId: null,
          statusFilter: "",
          search: "",
          loading: false,
          error: null,
          onSearchChange: () => {},
          onStatusChange: () => {},
          onSelectConversation: () => {},
        }}
        conversation={{
          conversation: null,
          loading: false,
          error: null,
          composerValue: "",
          onComposerChange: () => {},
          onGenerateDraft: () => {},
          onSendReply: () => {},
          canGenerateDraft: false,
          canSendReply: false,
          isGeneratingDraft: false,
          isSendingReply: false,
          composerError: null,
          aiDraftLabel: null,
          readOnlyMessage: "Read-only.",
          gmailOutboundStatus: null,
          gmailOutboundStatusLoading: false,
          gmailOutboundStatusError: null,
          webchatOutboundStatus: null,
          webchatOutboundStatusLoading: false,
          webchatOutboundStatusError: null,
        }}
        customer={{
          customer: null,
          customerLoading: false,
          customerError: null,
          activity: [],
          activityLoading: false,
          activityError: null,
        }}
        customerIntelligence={{
          customerIntelligence: null,
          customerIntelligenceLoading: false,
          customerIntelligenceError: null,
          customerTimelineIntelligence: null,
          customerTimelineIntelligenceLoading: false,
          customerTimelineIntelligenceError: null,
          customerActionProposal: null,
          customerActionProposalLoading: false,
          customerActionProposalError: null,
          customerFollowUpProposal: null,
          customerFollowUpProposalLoading: false,
          customerFollowUpProposalError: null,
          customerOwnerAssignmentReadiness: null,
          customerOwnerAssignmentReadinessLoading: false,
          customerOwnerAssignmentReadinessError: null,
          customerLifecycleStatusReadiness: null,
          customerLifecycleStatusReadinessLoading: false,
          customerLifecycleStatusReadinessError: null,
        }}
        automationGuardrails={{
          decision: null,
          loading: false,
          error: null,
          canEvaluate: false,
          onEvaluate: () => {},
        }}
        admin={{
          currentRole: "viewer",
          roleManagementReadiness: null,
          workspaceMembers: [],
          roleManagementLoading: false,
          roleManagementError: null,
        }}
      />,
    );

    const forbiddenActionLabels = [
      /charge/i,
      /invoice/i,
      /checkout/i,
      /export raw payload/i,
      /execute job/i,
      /send alert/i,
      /run load test/i,
      /auto-send/i,
    ];

    const actionableElements = [
      ...screen.queryAllByRole("button"),
      ...screen.queryAllByRole("link"),
    ];

    for (const element of actionableElements) {
      const text =
        within(element).queryByText(/.+/)?.textContent ??
        element.textContent ??
        "";

      for (const pattern of forbiddenActionLabels) {
        expect(text).not.toMatch(pattern);
      }
    }
  });

  it("keeps shell and navigation source free from raw HTML or token copy", () => {
    const combinedSource = `${shellSource}\n${navigationSource}\n${appSource}`;

    expect(combinedSource).not.toContain("dangerouslySetInnerHTML");
    expect(combinedSource.toLowerCase()).not.toContain("raw html");
    expect(combinedSource.toLowerCase()).not.toContain("authorization header");
  });
});
