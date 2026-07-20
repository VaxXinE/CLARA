export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    correlation_id: string;
    details?: Array<{
      path: string;
      message: string;
    }>;
  };
};

export type ApiPermissionHints = {
  can_view_conversation: boolean;
  can_view_customer_profile: boolean;
  can_view_activity: boolean;
  can_generate_ai_draft: boolean;
  can_send_reply: boolean;
};

export type MeResponse = {
  user: {
    id: string;
    role: "owner" | "agent" | "viewer";
  };
  organization: {
    id: string;
  };
  workspace: {
    id: string;
  };
  permissions: string[];
  auth: {
    method: "mock" | "provider";
  };
};

export type ConversationSummary = {
  id: string;
  source: string;
  provider?: string | null;
  status: string;
  snippet: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    display_name: string;
    source: string;
    status: string;
  };
  assigned_user: {
    id: string;
    display_name: string;
  } | null;
};

export type ConversationListResponse = {
  data: ConversationSummary[];
  pagination: {
    limit: number;
    next_cursor: string | null;
  };
  permissions: ApiPermissionHints;
};

export type ConversationDetail = {
  id: string;
  source: string;
  provider?: string | null;
  status: string;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    display_name: string;
    source: string;
    status: string;
  };
  assigned_user: {
    id: string;
    display_name: string;
  } | null;
  messages: Array<{
    id: string;
    direction: string;
    sender_type: string;
    sender_user_id: string | null;
    body: string;
    sent_at: string;
    delivery_status: string;
    created_at: string;
  }>;
};

export type ConversationDetailResponse = {
  conversation: ConversationDetail;
  permissions: ApiPermissionHints;
};

export type CustomerProfileResponse = {
  customer: {
    id: string;
    display_name: string;
    contact_identifier: string | null;
    source: string;
    status: string;
    notes_summary: string | null;
    last_interaction_at: string | null;
    created_at: string;
    updated_at: string;
  };
  permissions: ApiPermissionHints;
};

export type CustomerProfileIntelligenceResponse = {
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  profileHealth: {
    level: "healthy" | "needs_attention" | "incomplete" | "unknown";
    reasons: string[];
  };
  activitySignals: {
    lastConversationAt: string | null;
    lastReplyAt: string | null;
    openConversationCount: number;
    totalConversationCount: number;
    recentActivityCount: number;
  };
  relationshipSignals: {
    lifecycleSuggestion:
      "lead" | "active_customer" | "at_risk" | "inactive" | "unknown";
    lifecycleReason: string;
    statusSuggestion:
      "new" | "engaged" | "needs_follow_up" | "dormant" | "unknown";
    statusReason: string;
  };
  followUpSignals: {
    recommendedAction:
      | "none"
      | "review_customer"
      | "follow_up"
      | "update_profile_review"
      | "assign_owner_review";
    urgency: "low" | "medium" | "high";
    reason: string;
  };
  safety: {
    readOnly: true;
    mutationAllowed: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};

export type CustomerTimelineIntelligenceResponse = {
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  timeline: {
    events: Array<{
      id: string;
      occurredAt: string;
      type:
        | "customer_created"
        | "conversation_started"
        | "conversation_updated"
        | "inbound_message"
        | "outbound_reply"
        | "channel_event"
        | "activity_event"
        | "ai_suggestion"
        | "customer_profile_signal"
        | "unknown";
      source:
        | "customer"
        | "conversation"
        | "reply"
        | "activity"
        | "channel"
        | "ai_read_model"
        | "system";
      title: string;
      summary: string;
      channel: string | null;
      conversationId?: string;
      activityId?: string;
      replyId?: string;
      severity: "info" | "attention" | "risk" | "success";
      safeMetadata: Record<string, string | number | boolean | null>;
    }>;
  };
  intelligence: {
    keyMoments: string[];
    recentSignals: string[];
    riskFlags: string[];
    followUpHints: string[];
  };
  safety: {
    readOnly: true;
    mutationAllowed: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};

export type CustomerActionProposalResponse = {
  proposalId: string;
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  proposalType:
    | "follow_up_task_review"
    | "customer_note_review"
    | "status_change_review"
    | "lifecycle_change_review"
    | "owner_assignment_review"
    | "needs_attention_review";
  title: string;
  summary: string;
  proposedAction: {
    actionKind:
      | "create_task"
      | "save_note"
      | "update_status"
      | "update_lifecycle"
      | "assign_owner"
      | "mark_needs_attention"
      | "no_op";
    executionStatus: "review_only";
    mutationExecuted: false;
    requiresHumanApproval: true;
    requiredPermission: string;
  };
  risk: {
    level: "low" | "medium" | "high" | "critical";
    reasons: string[];
    blocked: boolean;
    blockedReason: string | null;
  };
  review: {
    reviewLabel: string;
    nextStep: string;
    warnings: string[];
  };
  safety: {
    readOnly: true;
    proposalOnly: true;
    mutationAllowed: false;
    actionExecuted: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};

export type CustomerFollowUpProposalResponse = {
  proposalId: string;
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  title: string;
  summary: string;
  followUp: {
    intent:
      | "review_customer"
      | "follow_up_customer"
      | "request_more_context"
      | "update_profile_review"
      | "re_engage_customer"
      | "no_op";
    recommendedChannel: "email" | "webchat" | "whatsapp" | "manual" | "unknown";
    urgency: "low" | "medium" | "high";
    dueWindow: "none" | "today" | "next_24h" | "next_48h" | "this_week";
    reason: string;
  };
  proposedTask: {
    taskTitle: string;
    taskDescription: string;
    executionStatus: "review_only";
    taskCreated: false;
    requiresHumanApproval: true;
    requiredPermission: string;
  };
  risk: {
    level: "low" | "medium" | "high" | "critical";
    reasons: string[];
    blocked: boolean;
    blockedReason: string | null;
  };
  review: {
    reviewLabel: string;
    nextStep: string;
    warnings: string[];
  };
  safety: {
    readOnly: true;
    proposalOnly: true;
    taskCreated: false;
    mutationAllowed: false;
    actionExecuted: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};

export type CustomerOwnerAssignmentReadinessResponse = {
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  readiness: {
    level:
      | "ready_for_review"
      | "needs_more_context"
      | "already_owned"
      | "blocked"
      | "unknown";
    reasons: string[];
  };
  currentOwnership: {
    hasOwner: boolean;
    ownerId: string | null;
    ownerRole: string | null;
    ownershipSource: "existing_customer_record" | "unknown";
  };
  suggestedAssignment: {
    recommendedRole:
      "sales" | "support" | "admin_review" | "owner_review" | "unknown";
    recommendedAction:
      | "no_op"
      | "review_assignment"
      | "assign_owner_review"
      | "escalate_to_admin_review"
      | "request_more_context";
    reason: string;
    executionStatus: "review_only";
    ownerAssigned: false;
    requiresHumanApproval: true;
    requiredPermission: string;
  };
  risk: {
    level: "low" | "medium" | "high" | "critical";
    reasons: string[];
    blocked: boolean;
    blockedReason: string | null;
  };
  safety: {
    readOnly: true;
    proposalOnly: true;
    ownerAssigned: false;
    mutationAllowed: false;
    actionExecuted: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};

export type CustomerLifecycleStatusReadinessResponse = {
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  currentState: {
    lifecycle: "lead" | "active_customer" | "at_risk" | "inactive" | "unknown";
    status: "new" | "engaged" | "needs_follow_up" | "dormant" | "unknown";
    source: "existing_customer_record" | "inferred_read_model" | "unknown";
  };
  readiness: {
    level:
      | "ready_for_review"
      | "needs_more_context"
      | "blocked"
      | "no_change_recommended"
      | "unknown";
    reasons: string[];
  };
  suggestedChange: {
    recommendedLifecycle:
      | "lead"
      | "active_customer"
      | "at_risk"
      | "inactive"
      | "unknown"
      | "no_change";
    recommendedStatus:
      | "new"
      | "engaged"
      | "needs_follow_up"
      | "dormant"
      | "unknown"
      | "no_change";
    recommendedAction:
      | "no_op"
      | "review_lifecycle_status"
      | "update_lifecycle_review"
      | "update_status_review"
      | "request_more_context"
      | "escalate_to_admin_review";
    reason: string;
    executionStatus: "review_only";
    lifecycleUpdated: false;
    statusUpdated: false;
    requiresHumanApproval: true;
    requiredPermission: string;
  };
  transitionPolicy: {
    allowedForReview: boolean;
    blockedReason: string | null;
    warnings: string[];
  };
  risk: {
    level: "low" | "medium" | "high" | "critical";
    reasons: string[];
    blocked: boolean;
    blockedReason: string | null;
  };
  safety: {
    readOnly: true;
    proposalOnly: true;
    lifecycleUpdated: false;
    statusUpdated: false;
    mutationAllowed: false;
    actionExecuted: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};

export type ActivityResponse = {
  data: {
    conversation_id: string;
    items: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      actor: {
        type: "system" | "user";
        id: string | null;
        name: string;
      };
      created_at: string;
    }>;
  };
};

export type AiDraftResponse = {
  data: {
    draft: {
      id: string;
      conversation_id: string;
      body: string;
      status: string;
      requires_human_review: true;
      created_at: string;
    };
    ai: {
      provider: string;
      model: string;
    };
  };
};

export type AiReplySuggestionResponse = {
  data: {
    suggestion: {
      suggestionId: string;
      type: "reply_suggestion";
      conversationId: string;
      customerId: string | null;
      suggestedText: string | null;
      summary: string | null;
      recommendedNextAction: string | null;
      safetyFlags: string[];
      requiresHumanApproval: true;
      blockedReason: string | null;
      safeReasonCode: string;
      contextBudgetSummary: {
        maxMessages: number;
        maxMessageChars: number;
        maxSnippetChars: number;
        includedMessages: number;
        truncatedMessages: number;
        includedSnippets: number;
        truncatedSnippets: number;
      };
      policyVersion: string;
      createdAt: string;
    };
    ai: {
      provider: "mock";
      model: string;
    };
  };
};

export type AiFollowUpRecommendationResponse = {
  data: {
    recommendation: {
      recommendationId: string;
      type: "follow_up_recommendation";
      conversationId: string;
      customerId: string | null;
      recommendations: Array<{
        recommendationType: string;
        title: string;
        rationale: string;
        suggestedTiming: string | null;
        suggestedMessage: string | null;
        priority: "low" | "normal" | "high";
        requiresHumanApproval: true;
        actionStatus: "recommendation_only";
      }>;
      summary: string | null;
      safetyFlags: string[];
      requiresHumanApproval: true;
      blockedReason: string | null;
      safeReasonCode: string;
      contextBudgetSummary: {
        maxMessages: number;
        maxMessageChars: number;
        maxSnippetChars: number;
        includedMessages: number;
        truncatedMessages: number;
        includedSnippets: number;
        truncatedSnippets: number;
      };
      policyVersion: string;
      createdAt: string;
    };
    ai: {
      provider: "mock";
      model: string;
    };
  };
};

export type AiConversationSummaryResponse = {
  data: {
    summary: {
      summaryId: string;
      type: "conversation_summary";
      conversationId: string;
      customerId: string | null;
      summaryText: string | null;
      keyPoints: string[];
      openQuestions: string[];
      riskFlags: string[];
      safetyFlags: string[];
      requiresHumanApproval: true;
      blockedReason: string | null;
      safeReasonCode: string;
      contextBudgetSummary: {
        maxMessages: number;
        maxMessageChars: number;
        maxSnippetChars: number;
        includedMessages: number;
        truncatedMessages: number;
        includedSnippets: number;
        truncatedSnippets: number;
      };
      policyVersion: string;
      createdAt: string;
    };
    ai: {
      provider: "mock";
      model: string;
    };
  };
};

export type AiCustomerNoteSuggestionResponse = {
  data: {
    noteSuggestion: {
      noteSuggestionId: string;
      type: "customer_note_suggestion";
      conversationId: string;
      customerId: string;
      suggestedNote: string | null;
      suggestedTags: string[];
      confidenceLevel: "low" | "medium" | "high";
      safetyFlags: string[];
      requiresHumanApproval: true;
      actionStatus: "suggestion_only";
      blockedReason: string | null;
      safeReasonCode: string;
      contextBudgetSummary: {
        maxMessages: number;
        maxMessageChars: number;
        maxSnippetChars: number;
        includedMessages: number;
        truncatedMessages: number;
        includedSnippets: number;
        truncatedSnippets: number;
      };
      policyVersion: string;
      createdAt: string;
    };
    ai: {
      provider: "mock";
      model: string;
    };
  };
};

export type AiDraftReviewStatus =
  "suggested" | "editing" | "approved" | "rejected" | "expired" | "blocked";

export type AiDraftReview = {
  draftId: string;
  suggestionId: string | null;
  conversationId: string;
  customerId: string | null;
  workspaceId: string;
  channel: string;
  status: AiDraftReviewStatus;
  draftText: string;
  editedText: string | null;
  reviewedByUserId: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  safeReasonCode: string;
  safetyFlags: string[];
  requiresHumanApproval: true;
  policyVersion: string;
  createdAt: string;
  updatedAt: string;
};

export type AiDraftReviewResponse = {
  data: {
    review: AiDraftReview;
  };
};

export type AiAutomationGuardrailDecision =
  "allowed" | "requires_human_approval" | "blocked";

export type AiAutomationGuardrail = {
  decisionId: string;
  decision: AiAutomationGuardrailDecision;
  actionType: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  blockedReason: string | null;
  safeReasonCode: string;
  safetyFlags: string[];
  requiresHumanApproval: boolean;
  actionStatus: "evaluation_only";
  policyVersion: string;
  createdAt: string;
};

export type AiAutomationGuardrailResponse = {
  data: {
    guardrail: AiAutomationGuardrail;
  };
};

export type ReplySendResponse = {
  data: {
    message?: {
      id: string;
      conversation_id: string;
      direction: "outbound";
      body: string;
      sender: {
        type: "user";
        id: string;
        name: string;
      };
      created_at: string;
    };
    send: {
      provider: string;
      status: "sent" | "simulated" | "failed";
      provider_message_id?: string;
      outbound_delivery_id?: string;
      reason_code?: string;
      sent_at?: string;
      correlation_id?: string;
    };
  };
};

export type GmailOutboundDeliveryStatus = {
  outbound_delivery_id: string;
  provider: "gmail";
  status: "sent" | "simulated" | "failed";
  reason_code?: string;
  provider_message_id?: string;
  conversation_id: string;
  sent_at?: string;
  failed_at?: string;
  created_at: string;
  correlation_id?: string;
};

export type GmailOutboundDeliveryStatusResponse = {
  data: GmailOutboundDeliveryStatus;
};

export type WebchatOutboundDeliveryStatus = {
  outbound_delivery_id: string;
  provider: "webchat";
  status: "pending" | "sent" | "simulated" | "failed" | "skipped";
  reason_code?: string;
  provider_message_id?: string;
  conversation_id: string;
  channel_account_id: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  correlation_id?: string;
};

export type WebchatOutboundDeliveryStatusResponse = {
  data: WebchatOutboundDeliveryStatus;
};

export type GmailSchedulerStatus = {
  scheduler_enabled: boolean;
  scheduler_running: boolean;
  interval_ms: number;
  max_accounts_per_tick: number;
  max_messages_per_account: number;
  last_started_at?: string;
  last_stopped_at?: string;
  last_tick_started_at?: string;
  last_tick_finished_at?: string;
  last_tick_status?: string;
  last_reason_code?: string;
};

export type GmailSchedulerStatusResponse = {
  data: GmailSchedulerStatus;
};

export type ChannelHealthStatus =
  | "connected"
  | "disconnected"
  | "degraded"
  | "auth_required"
  | "rate_limited"
  | "error"
  | "simulated_only"
  | "unsupported";

export type ChannelHealthItem = {
  channel: string;
  provider: string;
  status: ChannelHealthStatus;
  readinessLevel: "production" | "simulated" | "planned";
  workspaceId: string;
  accountId: string | null;
  safeSummary: string;
  safeReasonCode: string;
  lastCheckedAt: string | null;
  nextRecommendedAction: string;
};

export type ChannelHealthResponse = {
  data: {
    items: ChannelHealthItem[];
  };
};

export type WorkspaceMember = {
  user_id: string;
  display_name: string;
  email: string;
  role: "owner" | "agent" | "viewer" | string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export type WorkspaceMembersResponse = {
  data: {
    members: WorkspaceMember[];
  };
  permissions: {
    can_read_members: boolean;
    can_invite_users: false;
    can_update_roles: false;
    can_delete_users: false;
  };
};

export type RoleManagementReadiness = {
  status: "readiness_only";
  workspace_id: string;
  current_user: {
    id: string;
    role: string;
  };
  policy: {
    role: string;
    can_read_members: boolean;
    can_read_readiness: boolean;
    can_invite_users: false;
    can_update_roles: false;
    can_delete_users: false;
    mutation_status: "not_implemented";
  };
  disabled_controls: ["invite_user", "update_role", "delete_user"];
  message: string;
};

export type RoleManagementReadinessResponse = {
  data: RoleManagementReadiness;
};

export type AnalyticsMetricCategory =
  | "operational"
  | "customer_engagement"
  | "channel_performance"
  | "crm_workflow"
  | "audit_compliance"
  | "operator_productivity"
  | "sla_readiness";

export type AnalyticsReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p9";
  readiness: {
    analyticsFoundationReady: boolean;
    metricRegistryReady: boolean;
    metricContractReady: boolean;
    runtimeMetricsImplemented: false;
    scheduledAggregationImplemented: false;
    reportExportImplemented: false;
  };
  allowedCategories: AnalyticsMetricCategory[];
  blockedCategories: string[];
  privacy: {
    workspaceScoped: true;
    aggregateFirst: true;
    rawPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
    piiMinimized: true;
    policyVersion: string;
  };
  safety: {
    readOnly: true;
    mutationAllowed: false;
    actionExecuted: false;
    crmMutationExecuted: false;
    taskCreated: false;
    outboundSent: false;
  };
};

export type EnterpriseReadinessStatus = "ready" | "warning" | "blocked";

export type TenantIsolationReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  readiness: {
    backendAuthContextSourceOfTruth: true;
    clientWorkspaceIdAuthoritative: false;
    workspaceScopedReadsRequired: true;
    workspaceScopedWritesRequired: true;
    crossWorkspaceAccessDenied: true;
    safeErrorBehaviorRequired: true;
    auditOnBoundaryViolationRequired: true;
    dashboardUxBoundaryRequired: true;
    extensionBoundaryRequired: true;
  };
  checks: Array<{
    checkKey: string;
    label: string;
    description: string;
    status: EnterpriseReadinessStatus;
    severity: "info" | "warning" | "critical";
    evidenceType:
      | "policy"
      | "test"
      | "runtime_guardrail"
      | "dashboard_boundary"
      | "extension_boundary";
  }>;
  safety: {
    readOnly: true;
    mutationAllowed: false;
    rawTenantDataIncluded: false;
    rawCustomerMessagesIncluded: false;
    rawProviderPayloadIncluded: false;
    rawWebhookPayloadIncluded: false;
    rawAuditMetadataIncluded: false;
    secretsIncluded: false;
  };
};

export type PermissionAuditReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  permissionAudit: {
    leastPrivilegeRequired: true;
    roleBoundaryRequired: true;
    backendAuthorizationRequired: true;
    frontendRoleGuardIsUxOnly: true;
    permissionDeniedEventsAuditable: true;
    privilegedActionReviewRequired: true;
    safeAuditMetadataOnly: true;
  };
  roleBoundaries: Array<{
    role: "owner" | "agent" | "viewer";
    allowedSurfaceKeys: string[];
    deniedSurfaceKeys: string[];
    auditRequiredForDeniedAccess: true;
    mutationAllowed: false;
  }>;
  safety: {
    readOnly: true;
    mutationAllowed: false;
    permissionMutationAllowed: false;
    roleMutationAllowed: false;
    rawPermissionInternalsIncluded: false;
    rawAuditMetadataIncluded: false;
    secretsIncluded: false;
  };
};

export type AuditRetentionReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  retentionReadiness: {
    auditRetentionPolicyDefined: true;
    safeAuditMetadataOnly: true;
    rawSecretsProhibited: true;
    rawProviderPayloadProhibited: true;
    rawWebhookPayloadProhibited: true;
    deletionAutomationImplemented: false;
    legalHoldAutomationImplemented: false;
    retentionJobImplemented: false;
    exportImplemented: false;
  };
  categories: Array<{
    categoryKey: string;
    label: string;
    description: string;
    retentionIntent:
      "retain_for_audit" | "minimize" | "future_retention_review";
    dataClassification:
      "public" | "internal" | "confidential" | "restricted" | "secret";
    rawSensitiveDataAllowed: false;
    redactionRequired: true;
  }>;
  safety: {
    readOnly: true;
    mutationAllowed: false;
    deletionExecuted: false;
    legalHoldExecuted: false;
    exportExecuted: false;
    rawAuditMetadataIncluded: false;
    secretsIncluded: false;
  };
};

export type DataClassificationReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  classifications: Array<
    "public" | "internal" | "confidential" | "restricted" | "secret"
  >;
  dataClasses: Array<{
    dataClassKey: string;
    label: string;
    classification:
      "public" | "internal" | "confidential" | "restricted" | "secret";
    examples: string[];
    handlingRules: string[];
    redactionRequired: boolean;
    auditSafe: boolean;
    dashboardSafe: boolean;
    extensionSafe: boolean;
  }>;
  safety: {
    readOnly: true;
    rawSensitiveExamplesIncluded: false;
    secretsIncluded: false;
    rawCustomerMessagesIncluded: false;
    rawProviderPayloadIncluded: false;
    rawWebhookPayloadIncluded: false;
    rawAuditMetadataIncluded: false;
  };
};

export type RedactionHardeningReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  redaction: {
    tokenRedactionRequired: true;
    cookieRedactionRequired: true;
    authHeaderRedactionRequired: true;
    apiKeyRedactionRequired: true;
    providerPayloadRedactionRequired: true;
    webhookPayloadRedactionRequired: true;
    auditMetadataRedactionRequired: true;
    customerMessageRedactionRequiredForComplianceViews: true;
  };
  classifiers: Array<{
    classifierKey: string;
    label: string;
    detects: string[];
    action: "redact" | "block" | "classify";
    severity: "info" | "warning" | "critical";
  }>;
  safety: {
    readOnly: true;
    mutationAllowed: false;
    rawBeforeAfterSamplesIncluded: false;
    secretsIncluded: false;
  };
};

export type AdminSecurityControlsReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  adminSecurity: {
    backendAuthorizationRequired: true;
    leastPrivilegeRequired: true;
    privilegedActionAuditRequired: true;
    frontendRoleGuardIsUxOnly: true;
    roleMutationImplemented: false;
    permissionMutationImplemented: false;
    ssoImplemented: false;
    mfaImplemented: false;
    emergencyAccessPolicyDefined: true;
    adminActionReviewRequired: true;
  };
  controls: Array<{
    controlKey: string;
    label: string;
    description: string;
    status: "ready" | "planned" | "blocked";
    severity: "info" | "warning" | "critical";
    evidenceType:
      "policy" | "test" | "runtime_guardrail" | "dashboard_boundary";
  }>;
  safety: {
    readOnly: true;
    mutationAllowed: false;
    roleMutationAllowed: false;
    permissionMutationAllowed: false;
    rawPermissionInternalsIncluded: false;
    secretsIncluded: false;
  };
};

export type SessionPolicyReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  sessionPolicy: {
    secureCookieRequired: true;
    tokenStorageBoundaryRequired: true;
    sessionTimeoutPolicyDefined: true;
    idleTimeoutPolicyDefined: true;
    refreshTokenRotationPolicyDefined: true;
    revocationReadinessDefined: true;
    forceLogoutImplemented: false;
    sessionRevocationImplemented: false;
    mfaStepUpImplemented: false;
  };
  controls: Array<{
    controlKey: string;
    label: string;
    description: string;
    status: "ready" | "planned" | "blocked";
    severity: "info" | "warning" | "critical";
  }>;
  safety: {
    readOnly: true;
    mutationAllowed: false;
    sessionRevoked: false;
    forceLogoutExecuted: false;
    tokensIncluded: false;
    cookiesIncluded: false;
    authHeadersIncluded: false;
    secretsIncluded: false;
  };
};

export type ComplianceDashboardResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  readinessSummary: {
    enterpriseScopeReady: true;
    tenantIsolationReady: true;
    permissionAuditReady: true;
    auditRetentionReady: true;
    dataClassificationReady: true;
    redactionHardeningReady: true;
    adminSecurityControlsReady: true;
    sessionPolicyReady: true;
    evidenceReadinessImplemented: true;
    incidentResponseImplemented: true;
    backupRestoreImplemented: true;
    finalP10AuditImplemented: true;
  };
  categories: Array<{
    categoryKey: string;
    label: string;
    description: string;
    status: "ready" | "in_progress" | "planned" | "blocked";
    riskLevel: "low" | "medium" | "high" | "critical";
    safeEvidenceSummary: string;
  }>;
  safety: {
    readOnly: true;
    exportEnabled: false;
    evidenceDownloadEnabled: false;
    rawEvidenceIncluded: false;
    rawAuditMetadataIncluded: false;
    secretsIncluded: false;
    certificationClaimed: false;
  };
};

export type BackupRestoreReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  backupRestore: {
    backupPolicyDefined: true;
    restorePolicyDefined: true;
    recoveryObjectiveDefined: true;
    restoreTestReadinessDefined: true;
    backupJobImplemented: false;
    restoreJobImplemented: false;
    automatedBackupImplemented: false;
    automatedRestoreImplemented: false;
    destructiveOperationAllowed: false;
  };
  controls: Array<{
    controlKey: string;
    label: string;
    description: string;
    status: "ready" | "planned" | "blocked";
    severity: "info" | "warning" | "critical";
    evidenceType:
      "policy" | "checklist" | "runbook" | "test" | "dashboard_boundary";
  }>;
  safety: {
    readOnly: true;
    mutationAllowed: false;
    backupExecuted: false;
    restoreExecuted: false;
    dataDeleted: false;
    secretsIncluded: false;
    rawEvidenceIncluded: false;
  };
};

export type IncidentResponseReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  incidentResponse: {
    severityModelDefined: true;
    escalationPolicyDefined: true;
    communicationPolicyDefined: true;
    containmentChecklistDefined: true;
    evidencePreservationDefined: true;
    postIncidentReviewDefined: true;
    automatedIncidentExecutionImplemented: false;
    legalHoldAutomationImplemented: false;
    dataDeletionAutomationImplemented: false;
  };
  severityLevels: Array<"sev1" | "sev2" | "sev3" | "sev4">;
  controls: Array<{
    controlKey: string;
    label: string;
    description: string;
    status: "ready" | "planned" | "blocked";
    severity: "info" | "warning" | "critical";
    safeEvidenceSummary: string;
  }>;
  safety: {
    readOnly: true;
    mutationAllowed: false;
    incidentCreated: false;
    escalationExecuted: false;
    notificationSent: false;
    legalHoldExecuted: false;
    dataDeleted: false;
    rawEvidenceIncluded: false;
    secretsIncluded: false;
  };
};

export type EvidenceReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  evidenceReadiness: {
    evidenceCategoriesDefined: true;
    safeEvidenceSummaryOnly: true;
    rawEvidenceBrowsingImplemented: false;
    evidenceExportImplemented: false;
    evidenceDownloadImplemented: false;
    certificationClaimed: false;
    auditTrailLinked: true;
    retentionPolicyLinked: true;
  };
  categories: Array<{
    categoryKey: string;
    label: string;
    description: string;
    classification: "internal" | "confidential" | "restricted";
    evidenceSource:
      | "policy"
      | "test_result"
      | "runbook"
      | "runtime_guardrail"
      | "dashboard_boundary"
      | "extension_boundary";
    rawEvidenceIncluded: false;
    exportAllowed: false;
  }>;
  safety: {
    readOnly: true;
    exportEnabled: false;
    downloadEnabled: false;
    rawEvidenceIncluded: false;
    rawAuditMetadataIncluded: false;
    secretsIncluded: false;
    certificationClaimed: false;
  };
};

export type AnalyticsMetricCatalogResponse = {
  workspaceId: string;
  generatedAt: string;
  categories: AnalyticsMetricCategory[];
  metrics: Array<{
    metricKey: string;
    category: AnalyticsMetricCategory;
    label: string;
    description: string;
    valueType: "count" | "percentage" | "duration_ms" | "ratio" | "status";
    aggregationLevel: "workspace" | "channel" | "operator" | "customer_segment";
    implementationStatus:
      "policy_defined" | "foundation_ready" | "not_implemented_yet";
    privacy: {
      aggregated: true;
      rawPayloadIncluded: false;
      rawCustomerMessagesIncluded: false;
      workspaceScoped: true;
      piiMinimized: true;
    };
  }>;
};

export type CoreOperationalMetricsResponse = {
  workspaceId: string;
  generatedAt: string;
  timeWindow: "today" | "last_7_days" | "last_30_days";
  channel: "all" | "email" | "webchat" | "whatsapp";
  category: AnalyticsMetricCategory;
  metrics: Array<{
    metricKey: string;
    label: string;
    description: string;
    value: number | string;
    valueType: "count" | "percentage" | "duration_ms" | "ratio" | "status";
    aggregationLevel: "workspace" | "channel";
    implementationStatus: "implemented";
    privacy: {
      aggregated: true;
      rawPayloadIncluded: false;
      rawCustomerMessagesIncluded: false;
      workspaceScoped: true;
      piiMinimized: true;
      policyVersion: string;
    };
  }>;
  safety: {
    readOnly: true;
    mutationAllowed: false;
    actionExecuted: false;
    crmMutationExecuted: false;
    taskCreated: false;
    outboundSent: false;
    customerLevelDrilldown: false;
    reportExported: false;
  };
};

export type AnalyticsOverviewResponse = {
  workspaceId: string;
  generatedAt: string;
  timeWindow: "today" | "last_7_days" | "last_30_days";
  channel: "all" | "email" | "webchat" | "whatsapp";
  sections: {
    conversationVolume: CoreOperationalMetricsResponse;
    responseTimeSla: CoreOperationalMetricsResponse;
    channelPerformance: CoreOperationalMetricsResponse;
  };
  safety: CoreOperationalMetricsResponse["safety"];
};

export type CrmWorkflowMetricsResponse = {
  workspaceId: string;
  generatedAt: string;
  timeWindow: "today" | "last_7_days" | "last_30_days";
  category: AnalyticsMetricCategory;
  metrics: Array<{
    metricKey: string;
    label: string;
    description: string;
    value: number | string;
    valueType: "count" | "percentage" | "duration_ms" | "ratio" | "status";
    aggregationLevel: "workspace";
    implementationStatus: "implemented";
    privacy: {
      aggregated: true;
      rawPayloadIncluded: false;
      rawCustomerMessagesIncluded: false;
      rawProviderPayloadIncluded: false;
      rawWebhookPayloadIncluded: false;
      rawAuditMetadataIncluded: false;
      workspaceScoped: true;
      piiMinimized: true;
      policyVersion: string;
    };
  }>;
  safety: {
    readOnly: true;
    mutationAllowed: false;
    actionExecuted: false;
    crmMutationExecuted: false;
    taskCreated: false;
    customerNoteWritten: false;
    ownerAssigned: false;
    lifecycleStatusUpdated: false;
    outboundSent: false;
    customerLevelDrilldown: false;
    reportExported: false;
  };
};

export type KpiDashboardResponse = {
  workspaceId: string;
  generatedAt: string;
  timeWindow: "today" | "last_7_days" | "last_30_days";
  cards: Array<{
    cardKey: string;
    label: string;
    description: string;
    value: number | string;
    valueType: "count" | "percentage" | "duration_ms" | "ratio" | "status";
    category: AnalyticsMetricCategory;
    severity: "neutral" | "good" | "warning" | "critical";
    source:
      | "core_operational_metrics"
      | "crm_workflow_metrics"
      | "channel_performance_metrics"
      | "sla_readiness_metrics";
    privacy: {
      aggregated: true;
      workspaceScoped: true;
      rawPayloadIncluded: false;
      rawCustomerMessagesIncluded: false;
      piiMinimized: true;
    };
  }>;
  safety: {
    readOnly: true;
    exportEnabled: false;
    drilldownEnabled: false;
    mutationAllowed: false;
  };
  appliedFilters?: AnalyticsReportingFilterSummary["appliedFilters"];
  rejectedFilters?: AnalyticsReportingFilterSummary["rejectedFilters"];
  filterSafety?: AnalyticsReportingFilterSummary["filterSafety"];
  audit?: AnalyticsAuditEvent;
};

export type QueueJobReliabilityReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p11";
  queueJobReliability: {
    queueReliabilityPolicyDefined: true;
    retryPolicyDefined: true;
    idempotencyPolicyDefined: true;
    deadLetterReadinessDefined: true;
    failureClassificationDefined: true;
    workerImplemented: false;
    jobExecutionImplemented: false;
    autoRetryExecutionImplemented: false;
    destructiveCleanupImplemented: false;
  };
  controls: Array<{
    controlKey: string;
    label: string;
    description: string;
    status: "ready" | "planned" | "blocked";
    severity: "info" | "warning" | "critical";
    evidenceType:
      | "policy"
      | "test"
      | "runbook"
      | "runtime_guardrail"
      | "dashboard_boundary"
      | "extension_boundary";
  }>;
  retryBackoff: {
    boundedRetriesRequired: true;
    exponentialBackoffRequired: true;
    jitterRequired: true;
    maxAttemptsRequired: true;
    providerRateLimitRespectRequired: true;
    retryExecutionImplemented: false;
  };
  idempotency: {
    idempotencyKeyRequired: true;
    workspaceScopedDedupRequired: true;
    providerMessageScopedDedupRequired: true;
    replayProtectionRequired: true;
    replayExecutionImplemented: false;
  };
  deadLetter: {
    deadLetterStateRequired: true;
    poisonMessageClassificationRequired: true;
    safeOperatorReviewRequired: true;
    purgeImplemented: false;
  };
  safety: {
    readOnly: true;
    workspaceScoped: true;
    clientScopeIgnored: true;
    mutationAllowed: false;
    jobEnqueueAllowed: false;
    jobExecutionAllowed: false;
    retryExecutionAllowed: false;
    replayAllowed: false;
    purgeAllowed: false;
    rawJobPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
    rawProviderPayloadIncluded: false;
    rawWebhookPayloadIncluded: false;
    outboundSendAllowed: false;
    billingSideEffectsAllowed: false;
    aiProviderCallAllowed: false;
  };
};

export type RateLimitQuotaUsageReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p11";
  rateLimitReadiness: {
    policyDefined: true;
    perWorkspaceLimitDefined: true;
    perUserLimitDefined: true;
    perEndpointLimitDefined: true;
    burstLimitPolicyDefined: true;
    safe429BehaviorDefined: true;
    productionQuotaBlockingImplemented: false;
    destructiveThrottleImplemented: false;
  };
  quotaReadiness: {
    quotaPolicyDefined: true;
    softLimitPolicyDefined: true;
    hardLimitPolicyDefined: true;
    gracePeriodPolicyDefined: true;
    quotaEnforcementImplemented: false;
    entitlementMutationImplemented: false;
    planMutationImplemented: false;
  };
  usageMeteringReadiness: {
    aggregateUsageDefined: true;
    workspaceScopedUsageDefined: true;
    billingSafeMetadataDefined: true;
    rawUsageEventsExposed: false;
    customerLevelDrilldownImplemented: false;
    invoiceCreationImplemented: false;
    chargingImplemented: false;
  };
  controls: Array<{
    controlKey: string;
    label: string;
    description: string;
    status: "ready" | "planned" | "blocked";
    severity: "info" | "warning" | "critical";
    evidenceType:
      | "policy"
      | "test"
      | "runbook"
      | "runtime_guardrail"
      | "dashboard_boundary"
      | "extension_boundary";
  }>;
  usageSummary: {
    aggregateOnly: true;
    workspaceScoped: true;
    rawUsageEventsIncluded: false;
    rawCustomerMessagesIncluded: false;
    rawProviderPayloadIncluded: false;
    rawWebhookPayloadIncluded: false;
    safeBillingMetadataOnly: true;
  };
  billingMetadataBoundary: {
    providerNamesAllowed: true;
    planCodeAllowed: true;
    workspaceIdAllowed: true;
    aggregateCountersAllowed: true;
    rawUsageEventsAllowed: false;
    rawCustomerMessagesAllowed: false;
    rawProviderPayloadAllowed: false;
    rawWebhookPayloadAllowed: false;
    paymentCredentialsAllowed: false;
  };
  safety: {
    readOnly: true;
    mutationAllowed: false;
    quotaEnforced: false;
    quotaMutated: false;
    usageCounterMutated: false;
    subscriptionMutated: false;
    planMutated: false;
    entitlementMutated: false;
    customerCharged: false;
    invoiceCreated: false;
    paymentProviderCalled: false;
    secretsIncluded: false;
  };
};

export type AnalyticsReportingFilterSummary = {
  appliedFilters: {
    timeWindow: "today" | "last_7_days" | "last_30_days";
    channel: "all" | "email" | "webchat" | "whatsapp";
    category?: AnalyticsMetricCategory;
    operatorScoped: boolean;
  };
  rejectedFilters: Array<{
    key: string;
    reasonCode: string;
  }>;
  filterSafety: {
    workspaceScoped: true;
    clientWorkspaceIdIgnored: true;
    customerLevelDrilldown: false;
    reportExported: false;
    rawPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
  };
};

export type AnalyticsAuditEvent = {
  eventName: string;
  workspaceId: string;
  actorId: string;
  timestamp: string;
  safeFilterSummary: {
    timeWindow: string;
    channel: string;
    category: string;
    operatorScoped: boolean;
  };
  reasonCode: string;
};

export type DemoRole = "owner" | "agent" | "viewer";

export type DemoAuthProfile = {
  label: string;
  role: DemoRole;
  userId: string;
  organizationId: string;
  workspaceId: string;
};
