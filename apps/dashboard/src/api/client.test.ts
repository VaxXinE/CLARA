import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiClient } from "./client";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function getRequestHeaders(fetchMock: ReturnType<typeof vi.fn>) {
  const init = fetchMock.mock.calls[0]?.[1];

  expect(init).toBeDefined();

  return ((init as RequestInit).headers ?? {}) as Record<string, string>;
}

describe("ApiClient auth headers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("attaches mock auth headers in demo mode", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        user: {
          id: "usr_demo_agent",
          role: "agent",
        },
        organization: {
          id: "org_demo",
        },
        workspace: {
          id: "wks_demo_sales",
        },
        permissions: [],
        auth: {
          method: "mock",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
      demoAuthProfile: {
        label: "Agent",
        role: "agent",
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
    });

    await client.getMe();

    const headers = getRequestHeaders(fetchMock);

    expect(headers["x-mock-user-id"]).toBe("usr_demo_agent");
    expect(headers.authorization).toBeUndefined();
  });

  it("attaches Authorization header only when a provider access token exists", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        user: {
          id: "usr_demo_agent",
          role: "agent",
        },
        organization: {
          id: "org_demo",
        },
        workspace: {
          id: "wks_demo_sales",
        },
        permissions: [],
        auth: {
          method: "provider",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
      getAccessToken: async () => "provider-access-token",
    });

    await client.getMe();

    const headers = getRequestHeaders(fetchMock);

    expect(headers.authorization).toBe("Bearer provider-access-token");
    expect(headers["x-mock-user-id"]).toBeUndefined();
    expect(headers["x-mock-organization-id"]).toBeUndefined();
    expect(headers["x-mock-workspace-id"]).toBeUndefined();
    expect(headers["x-mock-role"]).toBeUndefined();
  });

  it("does not attach fake bearer headers when the token provider returns empty", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        user: {
          id: "usr_demo_agent",
          role: "agent",
        },
        organization: {
          id: "org_demo",
        },
        workspace: {
          id: "wks_demo_sales",
        },
        permissions: [],
        auth: {
          method: "provider",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
      getAccessToken: async () => "   ",
    });

    await client.getMe();

    const headers = getRequestHeaders(fetchMock);

    expect(headers.authorization).toBeUndefined();
  });

  it("loads Gmail scheduler status safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          scheduler_enabled: false,
          scheduler_running: false,
          interval_ms: 300000,
          max_accounts_per_tick: 10,
          max_messages_per_account: 25,
          last_reason_code: "runtime_disabled",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.getGmailSchedulerStatus();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/integrations/gmail/scheduler/status",
      expect.any(Object),
    );
    expect(response.data).toMatchObject({
      scheduler_enabled: false,
      last_reason_code: "runtime_disabled",
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
  });

  it("loads CRM workflow metrics safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        workspaceId: "wks_demo_sales",
        generatedAt: "2026-07-20T01:00:00.000Z",
        timeWindow: "last_7_days",
        category: "crm_workflow",
        metrics: [],
        safety: {
          readOnly: true,
          mutationAllowed: false,
          actionExecuted: false,
          crmMutationExecuted: false,
          taskCreated: false,
          outboundSent: false,
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({ baseUrl: "http://127.0.0.1:3000" });

    const response = await client.getCrmWorkflowMetrics();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/analytics/crm-workflow",
      expect.any(Object),
    );
    expect(response.workspaceId).toBe("wks_demo_sales");
    expect(JSON.stringify(response)).not.toContain("access_token");
  });

  it("loads tenant isolation readiness from the enterprise read-only endpoint", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        workspaceId: "wks_demo_sales",
        generatedAt: "2026-07-20T01:00:00.000Z",
        phase: "p10",
        readiness: {
          backendAuthContextSourceOfTruth: true,
          clientWorkspaceIdAuthoritative: false,
          workspaceScopedReadsRequired: true,
          workspaceScopedWritesRequired: true,
          crossWorkspaceAccessDenied: true,
          safeErrorBehaviorRequired: true,
          auditOnBoundaryViolationRequired: true,
          dashboardUxBoundaryRequired: true,
          extensionBoundaryRequired: true,
        },
        checks: [],
        safety: {
          readOnly: true,
          mutationAllowed: false,
          rawTenantDataIncluded: false,
          rawCustomerMessagesIncluded: false,
          rawProviderPayloadIncluded: false,
          rawWebhookPayloadIncluded: false,
          rawAuditMetadataIncluded: false,
          secretsIncluded: false,
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({ baseUrl: "http://127.0.0.1:3000" });

    const response = await client.getTenantIsolationReadiness();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/enterprise/tenant-isolation/readiness",
      expect.any(Object),
    );
    expect(response.workspaceId).toBe("wks_demo_sales");
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
  });

  it("loads permission audit readiness from the enterprise read-only endpoint", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        workspaceId: "wks_demo_sales",
        generatedAt: "2026-07-20T01:00:00.000Z",
        phase: "p10",
        permissionAudit: {
          leastPrivilegeRequired: true,
          roleBoundaryRequired: true,
          backendAuthorizationRequired: true,
          frontendRoleGuardIsUxOnly: true,
          permissionDeniedEventsAuditable: true,
          privilegedActionReviewRequired: true,
          safeAuditMetadataOnly: true,
        },
        roleBoundaries: [
          {
            role: "viewer",
            allowedSurfaceKeys: ["conversation_read"],
            deniedSurfaceKeys: ["reply_send"],
            auditRequiredForDeniedAccess: true,
            mutationAllowed: false,
          },
        ],
        safety: {
          readOnly: true,
          mutationAllowed: false,
          permissionMutationAllowed: false,
          roleMutationAllowed: false,
          rawPermissionInternalsIncluded: false,
          rawAuditMetadataIncluded: false,
          secretsIncluded: false,
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({ baseUrl: "http://127.0.0.1:3000" });

    const response = await client.getPermissionAuditReadiness();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/enterprise/permission-audit/readiness",
      expect.any(Object),
    );
    expect(response.roleBoundaries[0]?.role).toBe("viewer");
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
  });

  it("loads KPI dashboard cards safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        workspaceId: "wks_demo_sales",
        generatedAt: "2026-07-20T01:00:00.000Z",
        timeWindow: "last_7_days",
        cards: [
          {
            cardKey: "total_conversations",
            label: "Total conversations",
            description: "Aggregate workspace conversation volume.",
            value: 3,
            valueType: "count",
            category: "operational",
            severity: "neutral",
            source: "core_operational_metrics",
            privacy: {
              aggregated: true,
              workspaceScoped: true,
              rawPayloadIncluded: false,
              rawCustomerMessagesIncluded: false,
              piiMinimized: true,
            },
          },
        ],
        safety: {
          readOnly: true,
          exportEnabled: false,
          drilldownEnabled: false,
          mutationAllowed: false,
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({ baseUrl: "http://127.0.0.1:3000" });

    const response = await client.getKpiDashboard();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/analytics/kpi-dashboard",
      expect.any(Object),
    );
    expect(response.cards[0].cardKey).toBe("total_conversations");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
  });

  it("loads customer profile intelligence safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        customerId: "cust_demo_budi",
        workspaceId: "wks_demo_sales",
        generatedAt: "2026-01-10T00:00:00.000Z",
        profileHealth: {
          level: "needs_attention",
          reasons: ["Customer has open conversations to review."],
        },
        activitySignals: {
          lastConversationAt: "2026-01-09T00:00:00.000Z",
          lastReplyAt: null,
          openConversationCount: 1,
          totalConversationCount: 1,
          recentActivityCount: 1,
        },
        relationshipSignals: {
          lifecycleSuggestion: "active_customer",
          lifecycleReason:
            "Recent workspace-scoped conversation activity exists.",
          statusSuggestion: "needs_follow_up",
          statusReason: "Open conversations require human review.",
        },
        followUpSignals: {
          recommendedAction: "follow_up",
          urgency: "high",
          reason: "Review-only recommendation.",
        },
        safety: {
          readOnly: true,
          mutationAllowed: false,
          requiresHumanApprovalForMutation: true,
          policyVersion: "customer-profile-intelligence-read-model-v1",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response =
      await client.getCustomerProfileIntelligence("cust_demo_budi");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/customers/cust_demo_budi/intelligence",
      expect.any(Object),
    );
    expect(response.safety).toMatchObject({
      readOnly: true,
      mutationAllowed: false,
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
  });

  it("loads customer timeline intelligence safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        customerId: "cust_demo_budi",
        workspaceId: "wks_demo_sales",
        generatedAt: "2026-01-10T00:00:00.000Z",
        timeline: {
          events: [
            {
              id: "event_1",
              occurredAt: "2026-01-09T00:00:00.000Z",
              type: "inbound_message",
              source: "conversation",
              title: "Inbound message received",
              summary: "Safe summary.",
              channel: "gmail",
              severity: "info",
              safeMetadata: {},
            },
          ],
        },
        intelligence: {
          keyMoments: ["Timeline event found."],
          recentSignals: ["Recent safe signal found."],
          riskFlags: [],
          followUpHints: ["Review only."],
        },
        safety: {
          readOnly: true,
          mutationAllowed: false,
          requiresHumanApprovalForMutation: true,
          policyVersion: "customer-timeline-intelligence-read-model-v1",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response =
      await client.getCustomerTimelineIntelligence("cust_demo_budi");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/customers/cust_demo_budi/timeline/intelligence",
      expect.any(Object),
    );
    expect(response.safety).toMatchObject({
      readOnly: true,
      mutationAllowed: false,
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
  });

  it("loads customer lifecycle/status readiness safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        customerId: "cust_demo_budi",
        workspaceId: "wks_demo_sales",
        generatedAt: "2026-01-10T00:00:00.000Z",
        currentState: {
          lifecycle: "active_customer",
          status: "engaged",
          source: "existing_customer_record",
        },
        readiness: {
          level: "no_change_recommended",
          reasons: ["No lifecycle/status change is recommended."],
        },
        suggestedChange: {
          recommendedLifecycle: "no_change",
          recommendedStatus: "no_change",
          recommendedAction: "no_op",
          reason: "Current lifecycle/status does not need a change.",
          executionStatus: "review_only",
          lifecycleUpdated: false,
          statusUpdated: false,
          requiresHumanApproval: true,
          requiredPermission: "customer:read",
        },
        transitionPolicy: {
          allowedForReview: true,
          blockedReason: null,
          warnings: ["Human approval is required before any future change."],
        },
        risk: {
          level: "low",
          reasons: [
            "Future lifecycle/status changes require explicit human approval.",
          ],
          blocked: false,
          blockedReason: null,
        },
        safety: {
          readOnly: true,
          proposalOnly: true,
          lifecycleUpdated: false,
          statusUpdated: false,
          mutationAllowed: false,
          actionExecuted: false,
          requiresHumanApprovalForMutation: true,
          policyVersion: "lifecycle-status-update-readiness-v1",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response =
      await client.getCustomerLifecycleStatusReadiness("cust_demo_budi");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/customers/cust_demo_budi/lifecycle-status/readiness",
      expect.any(Object),
    );
    expect(response.safety).toMatchObject({
      readOnly: true,
      lifecycleUpdated: false,
      statusUpdated: false,
      actionExecuted: false,
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
  });

  it("requests reviewable CRM action proposals without mutation fields", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        proposalId: "crm_proposal_follow_up_task_review_cust_demo_budi",
        customerId: "cust_demo_budi",
        workspaceId: "wks_demo_sales",
        generatedAt: "2026-01-10T00:00:00.000Z",
        proposalType: "follow_up_task_review",
        title: "Review follow-up task proposal",
        summary: "Review-only proposal.",
        proposedAction: {
          actionKind: "create_task",
          executionStatus: "review_only",
          mutationExecuted: false,
          requiresHumanApproval: true,
          requiredPermission: "task:create",
        },
        risk: {
          level: "medium",
          reasons: ["Human review required."],
          blocked: false,
          blockedReason: null,
        },
        review: {
          reviewLabel: "Ready for human review",
          nextStep: "Review only.",
          warnings: ["No CRM mutation was executed."],
        },
        safety: {
          readOnly: true,
          proposalOnly: true,
          mutationAllowed: false,
          actionExecuted: false,
          requiresHumanApprovalForMutation: true,
          policyVersion: "reviewable-crm-action-proposal-v1",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.reviewCustomerActionProposal(
      "cust_demo_budi",
      {
        proposalType: "follow_up_task_review",
        source: "operator",
        operatorInstruction: "Review follow-up.",
      },
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/customers/cust_demo_budi/action-proposals/review",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(response.proposedAction).toMatchObject({
      executionStatus: "review_only",
      mutationExecuted: false,
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
  });

  it("requests reviewable follow-up proposals without task creation fields", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        proposalId: "follow_up_proposal_follow_up_customer_cust_demo_budi",
        customerId: "cust_demo_budi",
        workspaceId: "wks_demo_sales",
        generatedAt: "2026-01-10T00:00:00.000Z",
        title: "Review task / follow-up workflow proposal",
        summary: "Review-only follow-up proposal.",
        followUp: {
          intent: "follow_up_customer",
          recommendedChannel: "email",
          urgency: "medium",
          dueWindow: "next_24h",
          reason: "Review before task creation.",
        },
        proposedTask: {
          taskTitle: "Review follow-up task",
          taskDescription: "Review whether a task should be created.",
          executionStatus: "review_only",
          taskCreated: false,
          requiresHumanApproval: true,
          requiredPermission: "task:create",
        },
        risk: {
          level: "medium",
          reasons: ["Human review required."],
          blocked: false,
          blockedReason: null,
        },
        review: {
          reviewLabel: "Ready for human review",
          nextStep: "Review only.",
          warnings: ["No task was created."],
        },
        safety: {
          readOnly: true,
          proposalOnly: true,
          taskCreated: false,
          mutationAllowed: false,
          actionExecuted: false,
          requiresHumanApprovalForMutation: true,
          policyVersion: "task-follow-up-workflow-proposal-v1",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.reviewCustomerFollowUpProposal(
      "cust_demo_budi",
      {
        source: "operator",
        proposalIntent: "follow_up_customer",
        operatorInstruction: "Review follow-up.",
      },
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/customers/cust_demo_budi/follow-up-proposals/review",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(response.proposedTask).toMatchObject({
      executionStatus: "review_only",
      taskCreated: false,
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
  });

  it("loads customer owner assignment readiness without mutation fields", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        customerId: "cust_demo_budi",
        workspaceId: "wks_demo_sales",
        generatedAt: "2026-01-10T00:00:00.000Z",
        readiness: {
          level: "ready_for_review",
          reasons: ["Owner assignment readiness is review-only."],
        },
        currentOwnership: {
          hasOwner: false,
          ownerId: null,
          ownerRole: null,
          ownershipSource: "unknown",
        },
        suggestedAssignment: {
          recommendedRole: "sales",
          recommendedAction: "assign_owner_review",
          reason: "Review owner handoff.",
          executionStatus: "review_only",
          ownerAssigned: false,
          requiresHumanApproval: true,
          requiredPermission: "customer:assign_owner",
        },
        risk: {
          level: "medium",
          reasons: ["Human approval required."],
          blocked: false,
          blockedReason: null,
        },
        safety: {
          readOnly: true,
          proposalOnly: true,
          ownerAssigned: false,
          mutationAllowed: false,
          actionExecuted: false,
          requiresHumanApprovalForMutation: true,
          policyVersion: "owner-assignment-readiness-v1",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response =
      await client.getCustomerOwnerAssignmentReadiness("cust_demo_budi");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/customers/cust_demo_budi/owner-assignment/readiness",
      expect.objectContaining({
        headers: expect.objectContaining({
          "content-type": "application/json",
        }),
      }),
    );
    expect(response.suggestedAssignment).toMatchObject({
      executionStatus: "review_only",
      ownerAssigned: false,
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
  });

  it("creates an AI reply suggestion without sending a reply", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          data: {
            suggestion: {
              suggestionId: "ai_suggestion_demo",
              type: "reply_suggestion",
              conversationId: "conv_demo",
              customerId: "cust_demo",
              suggestedText: "Thanks for reaching out.",
              summary: "Safe preview.",
              recommendedNextAction: "Review before sending.",
              safetyFlags: [],
              requiresHumanApproval: true,
              blockedReason: null,
              safeReasonCode: "ai_suggestion_generated",
              contextBudgetSummary: {
                maxMessages: 12,
                maxMessageChars: 1200,
                maxSnippetChars: 1200,
                includedMessages: 1,
                truncatedMessages: 0,
                includedSnippets: 0,
                truncatedSnippets: 0,
              },
              policyVersion: "p7-ai-context-v1",
              createdAt: "2026-01-01T00:00:00.000Z",
            },
            ai: {
              provider: "mock",
              model: "mock-clara-reply-suggestion-v1",
            },
          },
        },
        201,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.createAiReplySuggestion({
      conversationId: "conv_demo",
      customerId: "cust_demo",
      tone: "friendly",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/ai/reply-suggestions",
      expect.objectContaining({
        method: "POST",
      }),
    );
    const fetchCall = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    const init = fetchCall[1];

    expect(fetchCall[0]).not.toContain("/reply/");
    expect(String(init.body)).not.toContain("send");
    expect(response.data.suggestion.requiresHumanApproval).toBe(true);
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
    expect(JSON.stringify(response)).not.toContain("rawHtml");
  });

  it("evaluates AI automation guardrails without executing an action", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          guardrail: {
            decisionId: "ai_auto_decision_demo",
            decision: "allowed",
            actionType: "suggest_reply",
            riskLevel: "low",
            blockedReason: null,
            safeReasonCode: "ai_automation_allowed",
            safetyFlags: [],
            requiresHumanApproval: false,
            actionStatus: "evaluation_only",
            policyVersion: "p7-ai-automation-guardrails-v1",
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.evaluateAiAutomationGuardrail({
      requestedAction: "suggest_reply",
      sourceFeature: "future_automation",
      conversationId: "conv_demo",
      customerId: "cust_demo",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/ai/automation-guardrails/evaluate",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(response.data.guardrail).toMatchObject({
      actionStatus: "evaluation_only",
      decision: "allowed",
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
  });

  it("creates an AI follow-up recommendation without task or schedule automation", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          data: {
            recommendation: {
              recommendationId: "ai_follow_up_demo",
              type: "follow_up_recommendation",
              conversationId: "conv_demo",
              customerId: "cust_demo",
              recommendations: [
                {
                  recommendationType: "follow_up_later",
                  title: "Follow up later",
                  rationale: "Human should review next step.",
                  suggestedTiming: "Next business day",
                  suggestedMessage: "I will follow up soon.",
                  priority: "normal",
                  requiresHumanApproval: true,
                  actionStatus: "recommendation_only",
                },
              ],
              summary: "Safe follow-up recommendation.",
              safetyFlags: [],
              requiresHumanApproval: true,
              blockedReason: null,
              safeReasonCode: "ai_follow_up_recommendation_generated",
              contextBudgetSummary: {
                maxMessages: 12,
                maxMessageChars: 1200,
                maxSnippetChars: 1200,
                includedMessages: 1,
                truncatedMessages: 0,
                includedSnippets: 0,
                truncatedSnippets: 0,
              },
              policyVersion: "p7-ai-context-v1",
              createdAt: "2026-01-01T00:00:00.000Z",
            },
            ai: {
              provider: "mock",
              model: "mock-clara-follow-up-recommendation-v1",
            },
          },
        },
        201,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.createAiFollowUpRecommendation({
      conversationId: "conv_demo",
      customerId: "cust_demo",
      urgency: "normal",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/ai/follow-up-recommendations",
      expect.objectContaining({
        method: "POST",
      }),
    );
    const fetchCall = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    const body = String(fetchCall[1].body);
    expect(body).toContain("follow_up_suggestion");
    expect(body).not.toContain("workspaceId");
    expect(response.data.recommendation.requiresHumanApproval).toBe(true);
    expect(JSON.stringify(response)).toContain("recommendation_only");
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
    expect(JSON.stringify(response)).not.toContain("rawHtml");
  });

  it("creates and approves AI draft reviews without exposing provider secrets", async () => {
    const review = {
      draftId: "draft_demo",
      suggestionId: "sug_demo",
      conversationId: "conv_demo",
      customerId: "cust_demo",
      workspaceId: "wks_demo_sales",
      channel: "gmail",
      status: "suggested",
      draftText: "Thanks for reaching out.",
      editedText: null,
      reviewedByUserId: null,
      approvedAt: null,
      rejectedAt: null,
      safeReasonCode: "ai_human_approval_required",
      safetyFlags: ["human_approval_required"],
      requiresHumanApproval: true,
      policyVersion: "p7_ai_draft_review_v1",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ data: { review } }, 201))
      .mockResolvedValueOnce(
        jsonResponse({
          data: {
            review: {
              ...review,
              status: "approved",
              approvedAt: "2026-01-01T00:01:00.000Z",
            },
          },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const created = await client.createAiDraftReview({
      conversationId: "conv_demo",
      customerId: "cust_demo",
      suggestionId: "sug_demo",
      draftText: "Thanks for reaching out.",
      safetyFlags: ["human_approval_required"],
    });
    const approved = await client.approveAiDraftReview("draft_demo");

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "http://127.0.0.1:3000/api/v1/ai/draft-reviews",
    );
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      "http://127.0.0.1:3000/api/v1/ai/draft-reviews/draft_demo/approve",
    );
    expect(created.data.review.requiresHumanApproval).toBe(true);
    expect(approved.data.review.status).toBe("approved");
    expect(JSON.stringify({ created, approved })).not.toContain(
      ["access", "token"].join("_"),
    );
    expect(JSON.stringify({ created, approved })).not.toContain(
      ["refresh", "token"].join("_"),
    );
    expect(JSON.stringify({ created, approved })).not.toContain(
      ["rawProvider", "Payload"].join(""),
    );
  });

  it("loads channel health safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          items: [
            {
              channel: "email",
              provider: "gmail",
              status: "connected",
              readinessLevel: "production",
              workspaceId: "wks_demo_sales",
              accountId: "channel_account_demo_gmail",
              safeSummary: "Demo Gmail is connected.",
              safeReasonCode: "connected",
              lastCheckedAt: null,
              nextRecommendedAction: "No action required.",
            },
          ],
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.getChannelHealth();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/channels/health",
      expect.any(Object),
    );
    expect(response.data.items[0]).toMatchObject({
      provider: "gmail",
      safeReasonCode: "connected",
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
    expect(JSON.stringify(response)).not.toContain("raw_provider_payload");
  });

  it("loads Gmail outbound delivery status safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          outbound_delivery_id: "email_outbound_demo",
          provider: "gmail",
          status: "simulated",
          reason_code: "simulated_send_completed",
          provider_message_id: "gmail_msg_demo",
          conversation_id: "conv_demo",
          created_at: "2026-01-01T00:00:00.000Z",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.getGmailOutboundDeliveryStatus(
      "email_outbound_demo",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/integrations/gmail/outbound/deliveries/email_outbound_demo",
      expect.any(Object),
    );
    expect(response.data).toMatchObject({
      provider: "gmail",
      status: "simulated",
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
  });

  it("loads Webchat outbound delivery status safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          outbound_delivery_id: "webchat_outbound_demo",
          provider: "webchat",
          status: "simulated",
          reason_code: "simulated_send_completed",
          provider_message_id: "webchat_msg_demo",
          conversation_id: "conv_demo",
          channel_account_id: "channel_account_demo_webchat",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.getWebchatOutboundDeliveryStatus(
      "webchat_outbound_demo",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/integrations/webchat/outbound/deliveries/webchat_outbound_demo",
      expect.any(Object),
    );
    expect(response.data).toMatchObject({
      provider: "webchat",
      status: "simulated",
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
    expect(JSON.stringify(response)).not.toContain("raw_provider");
  });

  it("loads user role management readiness safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
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
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.getRoleManagementReadiness();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/workspace/roles/readiness",
      expect.any(Object),
    );
    expect(response.data.policy.can_update_roles).toBe(false);
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
  });

  it("loads queue job reliability readiness safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        workspaceId: "wks_demo_sales",
        generatedAt: "2026-07-20T00:00:00.000Z",
        phase: "p11",
        queueJobReliability: {
          queueReliabilityPolicyDefined: true,
          retryPolicyDefined: true,
          idempotencyPolicyDefined: true,
          deadLetterReadinessDefined: true,
          failureClassificationDefined: true,
          workerImplemented: false,
          jobExecutionImplemented: false,
          autoRetryExecutionImplemented: false,
          destructiveCleanupImplemented: false,
        },
        controls: [],
        retryBackoff: {
          boundedRetriesRequired: true,
          exponentialBackoffRequired: true,
          jitterRequired: true,
          maxAttemptsRequired: true,
          providerRateLimitRespectRequired: true,
          retryExecutionImplemented: false,
        },
        idempotency: {
          idempotencyKeyRequired: true,
          workspaceScopedDedupRequired: true,
          providerMessageScopedDedupRequired: true,
          replayProtectionRequired: true,
          replayExecutionImplemented: false,
        },
        deadLetter: {
          deadLetterStateRequired: true,
          poisonMessageClassificationRequired: true,
          safeOperatorReviewRequired: true,
          purgeImplemented: false,
        },
        safety: {
          readOnly: true,
          workspaceScoped: true,
          clientScopeIgnored: true,
          mutationAllowed: false,
          jobEnqueueAllowed: false,
          jobExecutionAllowed: false,
          retryExecutionAllowed: false,
          replayAllowed: false,
          purgeAllowed: false,
          rawJobPayloadIncluded: false,
          rawCustomerMessagesIncluded: false,
          rawProviderPayloadIncluded: false,
          rawWebhookPayloadIncluded: false,
          outboundSendAllowed: false,
          billingSideEffectsAllowed: false,
          aiProviderCallAllowed: false,
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.getQueueJobReliabilityReadiness();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/reliability/queue-job/readiness",
      expect.any(Object),
    );
    expect(response.queueJobReliability.workerImplemented).toBe(false);
    expect(response.safety.jobExecutionAllowed).toBe(false);
    expect(JSON.stringify(response)).not.toContain("Bearer ");
    expect(JSON.stringify(response)).not.toContain("client_secret");
  });

  it("loads workspace members safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          members: [
            {
              user_id: "usr_demo_owner",
              display_name: "Owner Demo",
              email: "owner@example.test",
              role: "owner",
              status: "active",
              created_at: "2026-01-01T00:00:00.000Z",
              updated_at: "2026-01-01T00:00:00.000Z",
            },
          ],
        },
        permissions: {
          can_read_members: true,
          can_invite_users: false,
          can_update_roles: false,
          can_delete_users: false,
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.listWorkspaceMembers();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/workspace/members",
      expect.any(Object),
    );
    expect(response.data.members[0]?.role).toBe("owner");
    expect(response.permissions.can_invite_users).toBe(false);
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
  });

  it("creates an AI conversation summary without persisting customer notes", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          data: {
            summary: {
              summaryId: "ai_summary_demo",
              type: "conversation_summary",
              conversationId: "conv_demo",
              customerId: "cust_demo",
              summaryText: "Review-only summary.",
              keyPoints: [],
              openQuestions: [],
              riskFlags: [],
              safetyFlags: [],
              requiresHumanApproval: true,
              blockedReason: null,
              safeReasonCode: "ai_conversation_summary_generated",
              contextBudgetSummary: {
                maxMessages: 12,
                maxMessageChars: 1200,
                maxSnippetChars: 1200,
                includedMessages: 1,
                truncatedMessages: 0,
                includedSnippets: 0,
                truncatedSnippets: 0,
              },
              policyVersion: "p7-ai-context-v1",
              createdAt: "2026-01-01T00:00:00.000Z",
            },
            ai: { provider: "mock", model: "mock" },
          },
        },
        201,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({ baseUrl: "http://127.0.0.1:3000" });

    const response = await client.createAiConversationSummary({
      conversationId: "conv_demo",
      customerId: "cust_demo",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/ai/conversation-summaries",
      expect.objectContaining({ method: "POST" }),
    );
    const fetchCall = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(String(fetchCall[1].body)).not.toContain("save");
    expect(response.data.summary.requiresHumanApproval).toBe(true);
  });

  it("creates an AI customer note suggestion without CRM mutation", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          data: {
            noteSuggestion: {
              noteSuggestionId: "ai_note_demo",
              type: "customer_note_suggestion",
              conversationId: "conv_demo",
              customerId: "cust_demo",
              suggestedNote: "Review-only note.",
              suggestedTags: [],
              confidenceLevel: "medium",
              safetyFlags: [],
              requiresHumanApproval: true,
              actionStatus: "suggestion_only",
              blockedReason: null,
              safeReasonCode: "ai_customer_note_suggestion_generated",
              contextBudgetSummary: {
                maxMessages: 12,
                maxMessageChars: 1200,
                maxSnippetChars: 1200,
                includedMessages: 1,
                truncatedMessages: 0,
                includedSnippets: 0,
                truncatedSnippets: 0,
              },
              policyVersion: "p7-ai-context-v1",
              createdAt: "2026-01-01T00:00:00.000Z",
            },
            ai: { provider: "mock", model: "mock" },
          },
        },
        201,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({ baseUrl: "http://127.0.0.1:3000" });

    const response = await client.createAiCustomerNoteSuggestion({
      conversationId: "conv_demo",
      customerId: "cust_demo",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/ai/customer-note-suggestions",
      expect.objectContaining({ method: "POST" }),
    );
    const fetchCall = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(String(fetchCall[1].body)).not.toContain("mutate");
    expect(response.data.noteSuggestion.actionStatus).toBe("suggestion_only");
  });

  it("fetches P9 core operational analytics without sending mutation requests", async () => {
    const responseBody = {
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-07T10:00:00.000Z",
      timeWindow: "last_7_days",
      channel: "all",
      sections: {
        conversationVolume: { metrics: [] },
        responseTimeSla: { metrics: [] },
        channelPerformance: { metrics: [] },
      },
      safety: {
        readOnly: true,
        mutationAllowed: false,
        actionExecuted: false,
        crmMutationExecuted: false,
        taskCreated: false,
        outboundSent: false,
        customerLevelDrilldown: false,
        reportExported: false,
      },
    };
    const fetchMock = vi.fn(async () => jsonResponse(responseBody));
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({ baseUrl: "http://127.0.0.1:3000" });

    const response = await client.getAnalyticsOverview();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/analytics/overview",
      expect.objectContaining({ headers: expect.any(Object) }),
    );
    expect(response.safety.outboundSent).toBe(false);
  });
});
