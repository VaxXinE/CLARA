import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { ApiClient, ApiClientError } from "./api/client";
import type {
  ActivityResponse,
  AiConversationSummaryResponse,
  AiCustomerNoteSuggestionResponse,
  AiAutomationGuardrail,
  AiDraftResponse,
  AiDraftReview,
  AiFollowUpRecommendationResponse,
  AiReplySuggestionResponse,
  AuditRetentionReadinessResponse,
  ChannelHealthItem,
  ConversationDetailResponse,
  ConversationListResponse,
  CustomerProfileIntelligenceResponse,
  CustomerLifecycleStatusReadinessResponse,
  CustomerOwnerAssignmentReadinessResponse,
  CustomerProfileResponse,
  CustomerTimelineIntelligenceResponse,
  DataClassificationReadinessResponse,
  DemoAuthProfile,
  DemoRole,
  GmailOutboundDeliveryStatus,
  GmailSchedulerStatus,
  MeResponse,
  PermissionAuditReadinessResponse,
  RedactionHardeningReadinessResponse,
  RoleManagementReadiness,
  TenantIsolationReadinessResponse,
  WebchatOutboundDeliveryStatus,
  WorkspaceMember,
} from "./api/types";
import { AuthProvider } from "./auth/AuthProvider";
import {
  readDashboardAuthConfig,
  type DashboardAuthConfig,
} from "./auth/auth-config";
import type { DashboardAuthClient } from "./auth/supabase-auth-client";
import { useAuth } from "./auth/useAuth";
import { ConversationWorkspace } from "./components/ConversationWorkspace";
import { LoginPanel } from "./components/LoginPanel";
import { RoleSwitcher } from "./components/RoleSwitcher";
import { WorkspaceAccessRequiredPanel } from "./components/WorkspaceAccessRequiredPanel";
import { WorkspaceShell } from "./components/WorkspaceShell";
import type { WorkspaceNavigationRole } from "./navigation/workspace-navigation";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://127.0.0.1:3000";
const ROLE_STORAGE_KEY = "clara-dashboard-demo-role";

const demoProfiles: Record<DemoRole, DemoAuthProfile> = {
  owner: {
    label: "Owner",
    role: "owner",
    userId: "usr_demo_owner",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
  },
  agent: {
    label: "Agent",
    role: "agent",
    userId: "usr_demo_agent",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
  },
  viewer: {
    label: "Viewer",
    role: "viewer",
    userId: "usr_demo_viewer",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
  },
};

export type AppProps = {
  authConfig?: DashboardAuthConfig;
  authClient?: DashboardAuthClient;
};

function readStoredRole(): DemoRole {
  const fallback: DemoRole = "agent";

  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(ROLE_STORAGE_KEY);

  if (raw === "owner" || raw === "agent" || raw === "viewer") {
    return raw;
  }

  return fallback;
}

function buildClient(input: {
  authMode: DashboardAuthConfig["mode"];
  role: DemoRole;
  accessToken: string | null;
}): ApiClient {
  return new ApiClient({
    baseUrl: API_BASE_URL,
    demoAuthProfile:
      input.authMode === "demo" ? demoProfiles[input.role] : undefined,
    getAccessToken:
      input.authMode === "provider" ? async () => input.accessToken : undefined,
  });
}

function toSafeMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError) {
    return `${error.message} Reference: ${error.correlationId}`;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}

function WorkspaceAppShell() {
  const auth = useAuth();
  const [selectedRole, setSelectedRole] = useState<DemoRole>(readStoredRole);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [conversations, setConversations] = useState<
    ConversationListResponse["data"]
  >([]);
  const [conversationPermissions, setConversationPermissions] = useState<
    ConversationListResponse["permissions"] | null
  >(null);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [conversationDetail, setConversationDetail] = useState<
    ConversationDetailResponse["conversation"] | null
  >(null);
  const [customer, setCustomer] = useState<
    CustomerProfileResponse["customer"] | null
  >(null);
  const [customerIntelligence, setCustomerIntelligence] =
    useState<CustomerProfileIntelligenceResponse | null>(null);
  const [customerTimelineIntelligence, setCustomerTimelineIntelligence] =
    useState<CustomerTimelineIntelligenceResponse | null>(null);
  const [
    customerOwnerAssignmentReadiness,
    setCustomerOwnerAssignmentReadiness,
  ] = useState<CustomerOwnerAssignmentReadinessResponse | null>(null);
  const [
    customerLifecycleStatusReadiness,
    setCustomerLifecycleStatusReadiness,
  ] = useState<CustomerLifecycleStatusReadinessResponse | null>(null);
  const [activityItems, setActivityItems] = useState<
    ActivityResponse["data"]["items"]
  >([]);
  const [gmailSchedulerStatus, setGmailSchedulerStatus] =
    useState<GmailSchedulerStatus | null>(null);
  const [channelHealthItems, setChannelHealthItems] = useState<
    ChannelHealthItem[]
  >([]);
  const [gmailOutboundStatus, setGmailOutboundStatus] =
    useState<GmailOutboundDeliveryStatus | null>(null);
  const [webchatOutboundStatus, setWebchatOutboundStatus] =
    useState<WebchatOutboundDeliveryStatus | null>(null);
  const [roleManagementReadiness, setRoleManagementReadiness] =
    useState<RoleManagementReadiness | null>(null);
  const [tenantIsolationReadiness, setTenantIsolationReadiness] =
    useState<TenantIsolationReadinessResponse | null>(null);
  const [permissionAuditReadiness, setPermissionAuditReadiness] =
    useState<PermissionAuditReadinessResponse | null>(null);
  const [auditRetentionReadiness, setAuditRetentionReadiness] =
    useState<AuditRetentionReadinessResponse | null>(null);
  const [dataClassificationReadiness, setDataClassificationReadiness] =
    useState<DataClassificationReadinessResponse | null>(null);
  const [redactionHardeningReadiness, setRedactionHardeningReadiness] =
    useState<RedactionHardeningReadinessResponse | null>(null);
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>(
    [],
  );
  const [composerValue, setComposerValue] = useState("");
  const [draftId, setDraftId] = useState<string | null>(null);
  const [aiDraftLabel, setAiDraftLabel] = useState<string | null>(null);
  const [aiReplySuggestion, setAiReplySuggestion] = useState<
    AiReplySuggestionResponse["data"]["suggestion"] | null
  >(null);
  const [aiFollowUpRecommendation, setAiFollowUpRecommendation] = useState<
    AiFollowUpRecommendationResponse["data"]["recommendation"] | null
  >(null);
  const [aiConversationSummary, setAiConversationSummary] = useState<
    AiConversationSummaryResponse["data"]["summary"] | null
  >(null);
  const [aiCustomerNoteSuggestion, setAiCustomerNoteSuggestion] = useState<
    AiCustomerNoteSuggestionResponse["data"]["noteSuggestion"] | null
  >(null);
  const [aiDraftReview, setAiDraftReview] = useState<AiDraftReview | null>(
    null,
  );
  const [aiAutomationGuardrail, setAiAutomationGuardrail] =
    useState<AiAutomationGuardrail | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const [shellError, setShellError] = useState<string | null>(null);
  const [workspaceAccessRequired, setWorkspaceAccessRequired] = useState<
    string | null
  >(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [customerIntelligenceLoading, setCustomerIntelligenceLoading] =
    useState(false);
  const [customerIntelligenceError, setCustomerIntelligenceError] = useState<
    string | null
  >(null);
  const [
    customerTimelineIntelligenceLoading,
    setCustomerTimelineIntelligenceLoading,
  ] = useState(false);
  const [
    customerTimelineIntelligenceError,
    setCustomerTimelineIntelligenceError,
  ] = useState<string | null>(null);
  const [
    customerOwnerAssignmentReadinessLoading,
    setCustomerOwnerAssignmentReadinessLoading,
  ] = useState(false);
  const [
    customerOwnerAssignmentReadinessError,
    setCustomerOwnerAssignmentReadinessError,
  ] = useState<string | null>(null);
  const [
    customerLifecycleStatusReadinessLoading,
    setCustomerLifecycleStatusReadinessLoading,
  ] = useState(false);
  const [
    customerLifecycleStatusReadinessError,
    setCustomerLifecycleStatusReadinessError,
  ] = useState<string | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [gmailSchedulerLoading, setGmailSchedulerLoading] = useState(false);
  const [gmailSchedulerError, setGmailSchedulerError] = useState<string | null>(
    null,
  );
  const [channelHealthLoading, setChannelHealthLoading] = useState(false);
  const [channelHealthError, setChannelHealthError] = useState<string | null>(
    null,
  );
  const [gmailOutboundStatusLoading, setGmailOutboundStatusLoading] =
    useState(false);
  const [gmailOutboundStatusError, setGmailOutboundStatusError] = useState<
    string | null
  >(null);
  const [webchatOutboundStatusLoading, setWebchatOutboundStatusLoading] =
    useState(false);
  const [webchatOutboundStatusError, setWebchatOutboundStatusError] = useState<
    string | null
  >(null);
  const [roleManagementLoading, setRoleManagementLoading] = useState(false);
  const [roleManagementError, setRoleManagementError] = useState<string | null>(
    null,
  );
  const [tenantIsolationLoading, setTenantIsolationLoading] = useState(false);
  const [tenantIsolationError, setTenantIsolationError] = useState<
    string | null
  >(null);
  const [permissionAuditLoading, setPermissionAuditLoading] = useState(false);
  const [permissionAuditError, setPermissionAuditError] = useState<
    string | null
  >(null);
  const [auditRetentionLoading, setAuditRetentionLoading] = useState(false);
  const [auditRetentionError, setAuditRetentionError] = useState<string | null>(
    null,
  );
  const [dataClassificationLoading, setDataClassificationLoading] =
    useState(false);
  const [dataClassificationError, setDataClassificationError] = useState<
    string | null
  >(null);
  const [redactionHardeningLoading, setRedactionHardeningLoading] =
    useState(false);
  const [redactionHardeningError, setRedactionHardeningError] = useState<
    string | null
  >(null);
  const [composerError, setComposerError] = useState<string | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingNoteSuggestion, setIsGeneratingNoteSuggestion] =
    useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [followUpError, setFollowUpError] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [noteSuggestionError, setNoteSuggestionError] = useState<string | null>(
    null,
  );
  const [aiDraftReviewError, setAiDraftReviewError] = useState<string | null>(
    null,
  );
  const [aiDraftReviewLoading, setAiDraftReviewLoading] = useState(false);
  const [aiAutomationGuardrailLoading, setAiAutomationGuardrailLoading] =
    useState(false);
  const [aiAutomationGuardrailError, setAiAutomationGuardrailError] = useState<
    string | null
  >(null);
  const [isSendingReply, setIsSendingReply] = useState(false);

  useEffect(() => {
    if (auth.config.mode !== "demo" || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(ROLE_STORAGE_KEY, selectedRole);
  }, [auth.config.mode, selectedRole]);

  useEffect(() => {
    if (auth.status !== "authenticated") {
      setMe(null);
      setConversations([]);
      setConversationPermissions(null);
      setSelectedConversationId(null);
      setConversationDetail(null);
      setCustomer(null);
      setCustomerIntelligence(null);
      setCustomerTimelineIntelligence(null);
      setCustomerOwnerAssignmentReadiness(null);
      setActivityItems([]);
      setWorkspaceAccessRequired(null);
      setGmailSchedulerStatus(null);
      setGmailSchedulerError(null);
      setChannelHealthItems([]);
      setChannelHealthError(null);
      setGmailOutboundStatus(null);
      setGmailOutboundStatusError(null);
      setWebchatOutboundStatus(null);
      setWebchatOutboundStatusError(null);
      setRoleManagementReadiness(null);
      setWorkspaceMembers([]);
      setRoleManagementError(null);
      setComposerValue("");
      setDraftId(null);
      setAiDraftLabel(null);
      setAiReplySuggestion(null);
      setAiFollowUpRecommendation(null);
      setAiConversationSummary(null);
      setAiCustomerNoteSuggestion(null);
      setAiDraftReview(null);
      setAiDraftReviewError(null);
      setAiAutomationGuardrail(null);
      setAiAutomationGuardrailError(null);
      setSuggestionError(null);
      setFollowUpError(null);
      setSummaryError(null);
      setNoteSuggestionError(null);
      setGmailOutboundStatus(null);
      setGmailOutboundStatusError(null);
      setWebchatOutboundStatus(null);
      setWebchatOutboundStatusError(null);
      setListLoading(false);
      return;
    }

    let cancelled = false;

    async function loadShell() {
      const client = buildClient({
        authMode: auth.config.mode,
        role: selectedRole,
        accessToken: auth.session?.accessToken ?? null,
      });
      setShellError(null);
      setWorkspaceAccessRequired(null);
      setListError(null);
      setListLoading(true);
      setSelectedConversationId(null);
      setConversationDetail(null);
      setCustomer(null);
      setCustomerIntelligence(null);
      setCustomerTimelineIntelligence(null);
      setCustomerOwnerAssignmentReadiness(null);
      setActivityItems([]);
      setComposerValue("");
      setDraftId(null);
      setAiDraftLabel(null);
      setAiReplySuggestion(null);
      setAiFollowUpRecommendation(null);
      setAiConversationSummary(null);
      setAiCustomerNoteSuggestion(null);
      setAiDraftReview(null);
      setAiDraftReviewError(null);
      setAiAutomationGuardrail(null);
      setAiAutomationGuardrailError(null);
      setSuggestionError(null);
      setFollowUpError(null);
      setSummaryError(null);
      setNoteSuggestionError(null);

      try {
        const meResponse = await client.getMe();

        if (cancelled) {
          return;
        }

        setMe(meResponse);

        const listResponse = await client.listConversations({
          limit: 20,
          status: statusFilter || undefined,
          search: deferredSearch || undefined,
        });

        if (cancelled) {
          return;
        }

        setConversations(listResponse.data);
        setConversationPermissions(listResponse.permissions);

        startTransition(() => {
          setSelectedConversationId(listResponse.data[0]?.id ?? null);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (
          auth.config.mode === "provider" &&
          error instanceof ApiClientError &&
          error.statusCode === 403
        ) {
          setMe(null);
          setConversations([]);
          setConversationPermissions(null);
          setSelectedConversationId(null);
          setConversationDetail(null);
          setCustomer(null);
          setCustomerIntelligence(null);
          setCustomerTimelineIntelligence(null);
          setCustomerOwnerAssignmentReadiness(null);
          setActivityItems([]);
          setRoleManagementReadiness(null);
          setWorkspaceMembers([]);
          setRoleManagementError(null);
          setShellError(null);
          setListError(null);
          setWorkspaceAccessRequired(
            toSafeMessage(error, "Workspace access required."),
          );
          return;
        }

        const message = toSafeMessage(
          error,
          "Something went wrong. Please try again.",
        );
        setShellError(message);
        setListError(message);
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    }

    void loadShell();

    return () => {
      cancelled = true;
    };
  }, [
    auth.config.mode,
    auth.session?.accessToken,
    auth.status,
    deferredSearch,
    selectedRole,
    statusFilter,
  ]);

  useEffect(() => {
    if (auth.status !== "authenticated" || !me || me.user.role !== "owner") {
      setRoleManagementReadiness(null);
      setWorkspaceMembers([]);
      setRoleManagementLoading(false);
      setRoleManagementError(null);
      return;
    }

    let cancelled = false;

    async function loadRoleManagementReadiness() {
      const client = buildClient({
        authMode: auth.config.mode,
        role: selectedRole,
        accessToken: auth.session?.accessToken ?? null,
      });

      setRoleManagementLoading(true);
      setRoleManagementError(null);

      try {
        const [readinessResponse, membersResponse] = await Promise.all([
          client.getRoleManagementReadiness(),
          client.listWorkspaceMembers(),
        ]);

        if (!cancelled) {
          setRoleManagementReadiness(readinessResponse.data);
          setWorkspaceMembers(membersResponse.data.members);
        }
      } catch (error) {
        if (!cancelled) {
          setRoleManagementReadiness(null);
          setWorkspaceMembers([]);
          setRoleManagementError(
            toSafeMessage(error, "Access readiness is unavailable."),
          );
        }
      } finally {
        if (!cancelled) {
          setRoleManagementLoading(false);
        }
      }
    }

    void loadRoleManagementReadiness();

    return () => {
      cancelled = true;
    };
  }, [
    auth.config.mode,
    auth.session?.accessToken,
    auth.status,
    me,
    selectedRole,
  ]);

  useEffect(() => {
    if (auth.status !== "authenticated" || !me) {
      setTenantIsolationReadiness(null);
      setPermissionAuditReadiness(null);
      setAuditRetentionReadiness(null);
      setDataClassificationReadiness(null);
      setRedactionHardeningReadiness(null);
      setTenantIsolationLoading(false);
      setPermissionAuditLoading(false);
      setAuditRetentionLoading(false);
      setDataClassificationLoading(false);
      setRedactionHardeningLoading(false);
      setTenantIsolationError(null);
      setPermissionAuditError(null);
      setAuditRetentionError(null);
      setDataClassificationError(null);
      setRedactionHardeningError(null);
      return;
    }

    let cancelled = false;

    async function loadEnterpriseReadiness() {
      const client = buildClient({
        authMode: auth.config.mode,
        role: selectedRole,
        accessToken: auth.session?.accessToken ?? null,
      });

      setTenantIsolationLoading(true);
      setPermissionAuditLoading(true);
      setAuditRetentionLoading(true);
      setDataClassificationLoading(true);
      setRedactionHardeningLoading(true);
      setTenantIsolationError(null);
      setPermissionAuditError(null);
      setAuditRetentionError(null);
      setDataClassificationError(null);
      setRedactionHardeningError(null);

      try {
        const [
          tenantResponse,
          permissionResponse,
          auditRetentionResponse,
          dataClassificationResponse,
          redactionHardeningResponse,
        ] = await Promise.all([
          client.getTenantIsolationReadiness(),
          client.getPermissionAuditReadiness(),
          client.getAuditRetentionReadiness(),
          client.getDataClassificationReadiness(),
          client.getRedactionHardeningReadiness(),
        ]);

        if (!cancelled) {
          setTenantIsolationReadiness(tenantResponse);
          setPermissionAuditReadiness(permissionResponse);
          setAuditRetentionReadiness(auditRetentionResponse);
          setDataClassificationReadiness(dataClassificationResponse);
          setRedactionHardeningReadiness(redactionHardeningResponse);
        }
      } catch (error) {
        if (!cancelled) {
          setTenantIsolationReadiness(null);
          setPermissionAuditReadiness(null);
          setAuditRetentionReadiness(null);
          setDataClassificationReadiness(null);
          setRedactionHardeningReadiness(null);
          const message = toSafeMessage(
            error,
            "Enterprise readiness is unavailable.",
          );
          setTenantIsolationError(message);
          setPermissionAuditError(message);
          setAuditRetentionError(message);
          setDataClassificationError(message);
          setRedactionHardeningError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantIsolationLoading(false);
          setPermissionAuditLoading(false);
          setAuditRetentionLoading(false);
          setDataClassificationLoading(false);
          setRedactionHardeningLoading(false);
        }
      }
    }

    void loadEnterpriseReadiness();

    return () => {
      cancelled = true;
    };
  }, [
    auth.config.mode,
    auth.session?.accessToken,
    auth.status,
    me,
    selectedRole,
  ]);

  useEffect(() => {
    if (auth.status !== "authenticated" || !me || me.user.role === "viewer") {
      setGmailSchedulerStatus(null);
      setGmailSchedulerLoading(false);
      setGmailSchedulerError(null);
      return;
    }

    let cancelled = false;

    async function loadGmailSchedulerStatus() {
      const client = buildClient({
        authMode: auth.config.mode,
        role: selectedRole,
        accessToken: auth.session?.accessToken ?? null,
      });

      setGmailSchedulerLoading(true);
      setGmailSchedulerError(null);

      try {
        const response = await client.getGmailSchedulerStatus();

        if (!cancelled) {
          setGmailSchedulerStatus(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          setGmailSchedulerStatus(null);
          setGmailSchedulerError(
            toSafeMessage(error, "Gmail scheduler status is unavailable."),
          );
        }
      } finally {
        if (!cancelled) {
          setGmailSchedulerLoading(false);
        }
      }
    }

    void loadGmailSchedulerStatus();

    return () => {
      cancelled = true;
    };
  }, [
    auth.config.mode,
    auth.session?.accessToken,
    auth.status,
    me?.user.role,
    selectedRole,
  ]);

  useEffect(() => {
    if (auth.status !== "authenticated" || !me) {
      setChannelHealthItems([]);
      setChannelHealthLoading(false);
      setChannelHealthError(null);
      return;
    }

    let cancelled = false;

    async function loadChannelHealth() {
      const client = buildClient({
        authMode: auth.config.mode,
        role: selectedRole,
        accessToken: auth.session?.accessToken ?? null,
      });

      setChannelHealthLoading(true);
      setChannelHealthError(null);

      try {
        const response = await client.getChannelHealth();

        if (!cancelled) {
          setChannelHealthItems(response.data.items);
        }
      } catch (error) {
        if (!cancelled) {
          setChannelHealthItems([]);
          setChannelHealthError(
            toSafeMessage(error, "Channel health is unavailable."),
          );
        }
      } finally {
        if (!cancelled) {
          setChannelHealthLoading(false);
        }
      }
    }

    void loadChannelHealth();

    return () => {
      cancelled = true;
    };
  }, [
    auth.config.mode,
    auth.session?.accessToken,
    auth.status,
    me,
    selectedRole,
  ]);

  useEffect(() => {
    if (auth.status !== "authenticated" || !selectedConversationId) {
      setConversationDetail(null);
      setCustomer(null);
      setCustomerIntelligence(null);
      setCustomerTimelineIntelligence(null);
      setCustomerTimelineIntelligenceLoading(false);
      setCustomerTimelineIntelligenceError(null);
      setCustomerOwnerAssignmentReadiness(null);
      setCustomerOwnerAssignmentReadinessLoading(false);
      setCustomerOwnerAssignmentReadinessError(null);
      setCustomerLifecycleStatusReadiness(null);
      setCustomerLifecycleStatusReadinessLoading(false);
      setCustomerLifecycleStatusReadinessError(null);
      setActivityItems([]);
      return;
    }

    const conversationId = selectedConversationId;
    let cancelled = false;

    async function loadConversationWorkspace() {
      const client = buildClient({
        authMode: auth.config.mode,
        role: selectedRole,
        accessToken: auth.session?.accessToken ?? null,
      });
      setDetailLoading(true);
      setDetailError(null);
      setActivityLoading(true);
      setActivityError(null);
      setCustomerLoading(true);
      setCustomerError(null);
      setCustomerIntelligenceLoading(true);
      setCustomerIntelligenceError(null);
      setCustomerTimelineIntelligenceLoading(true);
      setCustomerTimelineIntelligenceError(null);
      setCustomerOwnerAssignmentReadinessLoading(true);
      setCustomerOwnerAssignmentReadinessError(null);
      setCustomerLifecycleStatusReadinessLoading(true);
      setCustomerLifecycleStatusReadinessError(null);
      setComposerError(null);
      setDraftId(null);
      setAiDraftLabel(null);
      setAiReplySuggestion(null);
      setAiDraftReview(null);
      setAiDraftReviewError(null);
      setAiAutomationGuardrail(null);
      setAiAutomationGuardrailError(null);
      setSuggestionError(null);
      setComposerValue("");
      setGmailOutboundStatus(null);
      setGmailOutboundStatusError(null);
      setWebchatOutboundStatus(null);
      setWebchatOutboundStatusError(null);

      try {
        const [detailResponse, activityResponse] = await Promise.all([
          client.getConversation(conversationId),
          client.getActivity(conversationId),
        ]);

        if (cancelled) {
          return;
        }

        setConversationDetail(detailResponse.conversation);
        setConversationPermissions(detailResponse.permissions);
        setActivityItems(activityResponse.data.items);

        const customerId = detailResponse.conversation.customer.id;
        const [
          customerResponse,
          customerIntelligenceResponse,
          customerTimelineIntelligenceResponse,
          customerOwnerAssignmentReadinessResponse,
          customerLifecycleStatusReadinessResponse,
        ] = await Promise.all([
          client.getCustomer(customerId),
          client.getCustomerProfileIntelligence(customerId),
          client.getCustomerTimelineIntelligence(customerId),
          client.getCustomerOwnerAssignmentReadiness(customerId),
          client.getCustomerLifecycleStatusReadiness(customerId),
        ]);

        if (cancelled) {
          return;
        }

        setCustomer(customerResponse.customer);
        setCustomerIntelligence(customerIntelligenceResponse);
        setCustomerTimelineIntelligence(customerTimelineIntelligenceResponse);
        setCustomerOwnerAssignmentReadiness(
          customerOwnerAssignmentReadinessResponse,
        );
        setCustomerLifecycleStatusReadiness(
          customerLifecycleStatusReadinessResponse,
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = toSafeMessage(
          error,
          "Conversation not found or you do not have access.",
        );
        setDetailError(message);
        setActivityError(message);
        setCustomerError(message);
        setCustomerIntelligenceError(message);
        setCustomerTimelineIntelligenceError(message);
        setCustomerOwnerAssignmentReadinessError(message);
        setCustomerLifecycleStatusReadinessError(message);
      } finally {
        if (!cancelled) {
          setDetailLoading(false);
          setActivityLoading(false);
          setCustomerLoading(false);
          setCustomerIntelligenceLoading(false);
          setCustomerTimelineIntelligenceLoading(false);
          setCustomerOwnerAssignmentReadinessLoading(false);
          setCustomerLifecycleStatusReadinessLoading(false);
        }
      }
    }

    void loadConversationWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    auth.config.mode,
    auth.session?.accessToken,
    auth.status,
    selectedConversationId,
    selectedRole,
  ]);

  const canGenerateDraft =
    conversationPermissions?.can_generate_ai_draft === true &&
    Boolean(conversationDetail);
  const canSendReply =
    conversationPermissions?.can_send_reply === true &&
    Boolean(conversationDetail);

  async function refreshConversationWorkspace(conversationId: string) {
    const client = buildClient({
      authMode: auth.config.mode,
      role: selectedRole,
      accessToken: auth.session?.accessToken ?? null,
    });
    const [listResponse, detailResponse, activityResponse] = await Promise.all([
      client.listConversations({
        limit: 20,
        status: statusFilter || undefined,
        search: deferredSearch || undefined,
      }),
      client.getConversation(conversationId),
      client.getActivity(conversationId),
    ]);
    const customerId = detailResponse.conversation.customer.id;
    const [
      customerResponse,
      customerIntelligenceResponse,
      customerTimelineIntelligenceResponse,
      customerOwnerAssignmentReadinessResponse,
      customerLifecycleStatusReadinessResponse,
    ] = await Promise.all([
      client.getCustomer(customerId),
      client.getCustomerProfileIntelligence(customerId),
      client.getCustomerTimelineIntelligence(customerId),
      client.getCustomerOwnerAssignmentReadiness(customerId),
      client.getCustomerLifecycleStatusReadiness(customerId),
    ]);

    setConversations(listResponse.data);
    setConversationPermissions(detailResponse.permissions);
    setConversationDetail(detailResponse.conversation);
    setActivityItems(activityResponse.data.items);
    setCustomer(customerResponse.customer);
    setCustomerIntelligence(customerIntelligenceResponse);
    setCustomerTimelineIntelligence(customerTimelineIntelligenceResponse);
    setCustomerOwnerAssignmentReadiness(
      customerOwnerAssignmentReadinessResponse,
    );
    setCustomerLifecycleStatusReadiness(
      customerLifecycleStatusReadinessResponse,
    );
  }

  async function handleGenerateDraft() {
    if (!selectedConversationId || !canGenerateDraft) {
      return;
    }

    const client = buildClient({
      authMode: auth.config.mode,
      role: selectedRole,
      accessToken: auth.session?.accessToken ?? null,
    });
    setIsGeneratingDraft(true);
    setComposerError(null);

    try {
      const response: AiDraftResponse = await client.createAiDraft(
        selectedConversationId,
        {
          tone: "friendly",
        },
      );

      setComposerValue(response.data.draft.body);
      setDraftId(response.data.draft.id);
      const reviewResponse = await client.getAiDraftReview(
        response.data.draft.id,
      );
      setAiDraftReview(reviewResponse.data.review);
      setAiDraftLabel("AI-assisted draft · Review before sending");
      await refreshConversationWorkspace(selectedConversationId);
    } catch (error) {
      setComposerError(
        toSafeMessage(
          error,
          "AI draft is unavailable right now. You can still write a manual reply.",
        ),
      );
    } finally {
      setIsGeneratingDraft(false);
    }
  }

  async function handleGenerateSuggestion() {
    if (!selectedConversationId || !conversationDetail || !canGenerateDraft) {
      return;
    }

    const client = buildClient({
      authMode: auth.config.mode,
      role: selectedRole,
      accessToken: auth.session?.accessToken ?? null,
    });
    setIsGeneratingSuggestion(true);
    setSuggestionError(null);

    try {
      const response = await client.createAiReplySuggestion({
        conversationId: selectedConversationId,
        customerId: conversationDetail.customer.id,
        tone: "friendly",
        maxLength: 800,
      });

      setAiReplySuggestion(response.data.suggestion);

      if (response.data.suggestion.suggestedText) {
        const reviewResponse = await client.createAiDraftReview({
          conversationId: selectedConversationId,
          customerId: conversationDetail.customer.id,
          suggestionId: response.data.suggestion.suggestionId,
          draftText: response.data.suggestion.suggestedText,
          safetyFlags: response.data.suggestion.safetyFlags,
        });

        setComposerValue(reviewResponse.data.review.draftText);
        setDraftId(reviewResponse.data.review.draftId);
        setAiDraftReview(reviewResponse.data.review);
        setAiDraftLabel("AI suggestion · Review before sending");
      }
    } catch (error) {
      setSuggestionError(
        toSafeMessage(error, "AI suggestion is unavailable right now."),
      );
    } finally {
      setIsGeneratingSuggestion(false);
    }
  }

  async function handleGenerateFollowUp() {
    if (!selectedConversationId || !conversationDetail || !canGenerateDraft) {
      return;
    }

    const client = buildClient({
      authMode: auth.config.mode,
      role: selectedRole,
      accessToken: auth.session?.accessToken ?? null,
    });
    setIsGeneratingFollowUp(true);
    setFollowUpError(null);

    try {
      const response = await client.createAiFollowUpRecommendation({
        conversationId: selectedConversationId,
        customerId: conversationDetail.customer.id,
        urgency: "normal",
        maxRecommendations: 3,
      });

      setAiFollowUpRecommendation(response.data.recommendation);
    } catch (error) {
      setFollowUpError(
        toSafeMessage(error, "AI follow-up recommendation is unavailable."),
      );
    } finally {
      setIsGeneratingFollowUp(false);
    }
  }

  async function handleGenerateSummary() {
    if (!selectedConversationId || !conversationDetail || !canGenerateDraft) {
      return;
    }

    const client = buildClient({
      authMode: auth.config.mode,
      role: selectedRole,
      accessToken: auth.session?.accessToken ?? null,
    });
    setIsGeneratingSummary(true);
    setSummaryError(null);

    try {
      const response = await client.createAiConversationSummary({
        conversationId: selectedConversationId,
        customerId: conversationDetail.customer.id,
        summaryStyle: "brief",
        maxLength: 600,
      });

      setAiConversationSummary(response.data.summary);
    } catch (error) {
      setSummaryError(toSafeMessage(error, "AI summary is unavailable."));
    } finally {
      setIsGeneratingSummary(false);
    }
  }

  async function handleGenerateNoteSuggestion() {
    if (!selectedConversationId || !conversationDetail || !canGenerateDraft) {
      return;
    }

    const client = buildClient({
      authMode: auth.config.mode,
      role: selectedRole,
      accessToken: auth.session?.accessToken ?? null,
    });
    setIsGeneratingNoteSuggestion(true);
    setNoteSuggestionError(null);

    try {
      const response = await client.createAiCustomerNoteSuggestion({
        conversationId: selectedConversationId,
        customerId: conversationDetail.customer.id,
        noteStyle: "short_note",
        maxLength: 400,
      });

      setAiCustomerNoteSuggestion(response.data.noteSuggestion);
    } catch (error) {
      setNoteSuggestionError(
        toSafeMessage(error, "AI note suggestion is unavailable."),
      );
    } finally {
      setIsGeneratingNoteSuggestion(false);
    }
  }

  async function handleEditDraftReview(draftText: string) {
    if (!aiDraftReview) {
      return;
    }

    const client = buildClient({
      authMode: auth.config.mode,
      role: selectedRole,
      accessToken: auth.session?.accessToken ?? null,
    });
    setAiDraftReviewLoading(true);
    setAiDraftReviewError(null);

    try {
      const response = await client.editAiDraftReview(aiDraftReview.draftId, {
        draftText,
      });
      setAiDraftReview(response.data.review);
      setComposerValue(
        response.data.review.editedText ?? response.data.review.draftText,
      );
      setDraftId(response.data.review.draftId);
    } catch (error) {
      setAiDraftReviewError(
        toSafeMessage(error, "AI draft review could not be edited."),
      );
    } finally {
      setAiDraftReviewLoading(false);
    }
  }

  async function handleApproveDraftReview() {
    if (!aiDraftReview) {
      return;
    }

    const client = buildClient({
      authMode: auth.config.mode,
      role: selectedRole,
      accessToken: auth.session?.accessToken ?? null,
    });
    setAiDraftReviewLoading(true);
    setAiDraftReviewError(null);

    try {
      const response = await client.approveAiDraftReview(aiDraftReview.draftId);
      setAiDraftReview(response.data.review);
      setDraftId(response.data.review.draftId);
    } catch (error) {
      setAiDraftReviewError(
        toSafeMessage(error, "AI draft review could not be approved."),
      );
    } finally {
      setAiDraftReviewLoading(false);
    }
  }

  async function handleRejectDraftReview() {
    if (!aiDraftReview) {
      return;
    }

    const client = buildClient({
      authMode: auth.config.mode,
      role: selectedRole,
      accessToken: auth.session?.accessToken ?? null,
    });
    setAiDraftReviewLoading(true);
    setAiDraftReviewError(null);

    try {
      const response = await client.rejectAiDraftReview(aiDraftReview.draftId);
      setAiDraftReview(response.data.review);
    } catch (error) {
      setAiDraftReviewError(
        toSafeMessage(error, "AI draft review could not be rejected."),
      );
    } finally {
      setAiDraftReviewLoading(false);
    }
  }

  async function handleEvaluateAutomationGuardrail() {
    if (!selectedConversationId || !conversationDetail) {
      return;
    }

    const client = buildClient({
      authMode: auth.config.mode,
      role: selectedRole,
      accessToken: auth.session?.accessToken ?? null,
    });
    setAiAutomationGuardrailLoading(true);
    setAiAutomationGuardrailError(null);

    try {
      const response = await client.evaluateAiAutomationGuardrail({
        requestedAction: "suggest_reply",
        sourceFeature: "future_automation",
        conversationId: selectedConversationId,
        customerId: conversationDetail.customer.id,
      });

      setAiAutomationGuardrail(response.data.guardrail);
    } catch (error) {
      setAiAutomationGuardrailError(
        toSafeMessage(error, "AI guardrail check is unavailable."),
      );
    } finally {
      setAiAutomationGuardrailLoading(false);
    }
  }

  async function handleSendReply() {
    if (!selectedConversationId || !canSendReply) {
      return;
    }

    if (aiDraftReview && aiDraftReview.status !== "approved") {
      setComposerError("AI draft requires explicit human approval first.");
      return;
    }

    const client = buildClient({
      authMode: auth.config.mode,
      role: selectedRole,
      accessToken: auth.session?.accessToken ?? null,
    });
    setIsSendingReply(true);
    setComposerError(null);

    try {
      const response = await client.sendReply(selectedConversationId, {
        body: composerValue,
        draft_id: draftId ?? undefined,
      });
      setComposerValue("");
      setDraftId(null);
      setAiDraftLabel(null);
      setAiReplySuggestion(null);
      setAiFollowUpRecommendation(null);
      setAiConversationSummary(null);
      setAiCustomerNoteSuggestion(null);
      setAiDraftReview(null);
      setAiDraftReviewError(null);
      setAiAutomationGuardrail(null);
      setAiAutomationGuardrailError(null);
      setSuggestionError(null);
      setFollowUpError(null);
      setSummaryError(null);
      setNoteSuggestionError(null);
      setGmailOutboundStatus(null);
      setGmailOutboundStatusError(null);
      setWebchatOutboundStatus(null);
      setWebchatOutboundStatusError(null);
      const outboundDeliveryId = response.data.send.outbound_delivery_id;

      if (outboundDeliveryId && response.data.send.provider === "gmail") {
        setGmailOutboundStatusLoading(true);

        try {
          const statusResponse =
            await client.getGmailOutboundDeliveryStatus(outboundDeliveryId);
          setGmailOutboundStatus(statusResponse.data);
        } catch (error) {
          setGmailOutboundStatusError(
            toSafeMessage(error, "Gmail outbound status is unavailable."),
          );
        } finally {
          setGmailOutboundStatusLoading(false);
        }
      }

      if (outboundDeliveryId && response.data.send.provider === "webchat") {
        setWebchatOutboundStatusLoading(true);

        try {
          const statusResponse =
            await client.getWebchatOutboundDeliveryStatus(outboundDeliveryId);
          setWebchatOutboundStatus(statusResponse.data);
        } catch (error) {
          setWebchatOutboundStatusError(
            toSafeMessage(error, "Webchat outbound status is unavailable."),
          );
        } finally {
          setWebchatOutboundStatusLoading(false);
        }
      }

      await refreshConversationWorkspace(selectedConversationId);
    } catch (error) {
      setComposerError(
        toSafeMessage(
          error,
          "Reply could not be sent. Your draft is still here. Please try again.",
        ),
      );
    } finally {
      setIsSendingReply(false);
    }
  }

  async function handleProviderLogin(input: {
    email: string;
    password: string;
  }) {
    await auth.signIn(input);
  }

  const authSlot =
    auth.config.mode === "demo" ? (
      <div className="meta-cluster">
        <span className="environment-badge">Demo auth</span>
        <RoleSwitcher
          profiles={demoProfiles}
          value={selectedRole}
          onChange={setSelectedRole}
        />
      </div>
    ) : (
      <div className="meta-cluster">
        <span className="environment-badge">Provider auth</span>
        {auth.status === "authenticated" ? (
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              void auth.signOut();
            }}
          >
            Log Out
          </button>
        ) : null}
      </div>
    );

  const metaSlot =
    auth.status === "authenticated" ? (
      <div className="meta-cluster">
        <span className="workspace-pill">
          Workspace: {me?.workspace.id ?? "loading"}
        </span>
        <span className="workspace-pill">
          User: {me?.user.id ?? auth.session?.email ?? "loading"} (
          {me?.user.role ?? "..."})
        </span>
      </div>
    ) : null;
  const navigationRole: WorkspaceNavigationRole =
    me?.user.role ??
    (auth.config.mode === "provider" ? "viewer" : selectedRole);

  if (auth.config.mode === "provider" && auth.status === "loading") {
    return (
      <WorkspaceShell
        title="Conversation workspace"
        authSlot={authSlot}
        metaSlot={metaSlot}
        navigationRole={navigationRole}
      >
        <section className="login-shell">
          <div className="login-card">
            <p>Checking your session...</p>
          </div>
        </section>
      </WorkspaceShell>
    );
  }

  if (auth.config.mode === "provider" && auth.status !== "authenticated") {
    return (
      <WorkspaceShell
        title="Conversation workspace"
        authSlot={authSlot}
        metaSlot={metaSlot}
        navigationRole={navigationRole}
      >
        <LoginPanel
          loading={auth.status === "loading"}
          error={auth.error}
          onSubmit={handleProviderLogin}
        />
      </WorkspaceShell>
    );
  }

  if (auth.config.mode === "provider" && workspaceAccessRequired) {
    return (
      <WorkspaceShell
        title="Conversation workspace"
        authSlot={authSlot}
        metaSlot={metaSlot}
        navigationRole={navigationRole}
      >
        <WorkspaceAccessRequiredPanel
          message={workspaceAccessRequired}
          onSignOut={() => {
            void auth.signOut();
          }}
        />
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell
      title="Conversation workspace"
      authSlot={authSlot}
      metaSlot={metaSlot}
      navigationRole={navigationRole}
    >
      {shellError ? (
        <div className="global-alert">
          <strong>Something went wrong.</strong>
          <p>{shellError}</p>
        </div>
      ) : null}

      <ConversationWorkspace
        scheduler={{
          status: gmailSchedulerStatus,
          loading: gmailSchedulerLoading,
          error: gmailSchedulerError,
        }}
        tenantIsolation={{
          readiness: tenantIsolationReadiness,
          loading: tenantIsolationLoading,
          error: tenantIsolationError,
        }}
        permissionAudit={{
          readiness: permissionAuditReadiness,
          loading: permissionAuditLoading,
          error: permissionAuditError,
        }}
        auditRetention={{
          readiness: auditRetentionReadiness,
          loading: auditRetentionLoading,
          error: auditRetentionError,
        }}
        dataClassification={{
          readiness: dataClassificationReadiness,
          loading: dataClassificationLoading,
          error: dataClassificationError,
        }}
        redactionHardening={{
          readiness: redactionHardeningReadiness,
          loading: redactionHardeningLoading,
          error: redactionHardeningError,
        }}
        channelHealth={{
          items: channelHealthItems,
          loading: channelHealthLoading,
          error: channelHealthError,
        }}
        inbox={{
          conversations,
          selectedConversationId,
          statusFilter,
          search,
          loading: listLoading,
          error: listError,
          onSearchChange: setSearch,
          onStatusChange: setStatusFilter,
          onSelectConversation: (conversationId) =>
            startTransition(() => {
              setSelectedConversationId(conversationId);
            }),
        }}
        conversation={{
          conversation: conversationDetail,
          loading: detailLoading,
          error: detailError,
          composerValue,
          onComposerChange: setComposerValue,
          onGenerateDraft: handleGenerateDraft,
          onSendReply: handleSendReply,
          canGenerateDraft,
          canSendReply,
          isGeneratingDraft,
          isSendingReply,
          composerError,
          aiDraftLabel,
          readOnlyMessage:
            me?.user.role === "viewer"
              ? "You have view-only access to this conversation."
              : null,
          aiReplySuggestion,
          aiFollowUpRecommendation,
          aiConversationSummary,
          aiCustomerNoteSuggestion,
          isGeneratingFollowUp,
          isGeneratingSummary,
          isGeneratingNoteSuggestion,
          followUpError,
          summaryError,
          noteSuggestionError,
          onGenerateFollowUp: handleGenerateFollowUp,
          onGenerateSummary: handleGenerateSummary,
          onGenerateNoteSuggestion: handleGenerateNoteSuggestion,
          aiDraftReview,
          aiDraftReviewLoading,
          aiDraftReviewError,
          onEditDraftReview: handleEditDraftReview,
          onApproveDraftReview: handleApproveDraftReview,
          onRejectDraftReview: handleRejectDraftReview,
          isGeneratingSuggestion,
          suggestionError,
          onGenerateSuggestion: handleGenerateSuggestion,
          gmailOutboundStatus,
          gmailOutboundStatusLoading,
          gmailOutboundStatusError,
          webchatOutboundStatus,
          webchatOutboundStatusLoading,
          webchatOutboundStatusError,
        }}
        customer={{
          customer,
          customerLoading,
          customerError,
          activity: activityItems,
          activityLoading,
          activityError,
        }}
        customerIntelligence={{
          customerIntelligence,
          customerIntelligenceLoading,
          customerIntelligenceError,
          customerTimelineIntelligence,
          customerTimelineIntelligenceLoading,
          customerTimelineIntelligenceError,
          customerActionProposal: null,
          customerActionProposalLoading: false,
          customerActionProposalError: null,
          customerFollowUpProposal: null,
          customerFollowUpProposalLoading: false,
          customerFollowUpProposalError: null,
          customerOwnerAssignmentReadiness,
          customerOwnerAssignmentReadinessLoading,
          customerOwnerAssignmentReadinessError,
          customerLifecycleStatusReadiness,
          customerLifecycleStatusReadinessLoading,
          customerLifecycleStatusReadinessError,
        }}
        automationGuardrails={{
          decision: aiAutomationGuardrail,
          loading: aiAutomationGuardrailLoading,
          error: aiAutomationGuardrailError,
          canEvaluate: Boolean(
            conversationDetail && me?.user.role !== "viewer",
          ),
          onEvaluate: handleEvaluateAutomationGuardrail,
        }}
        admin={{
          currentRole: me?.user.role ?? navigationRole,
          roleManagementReadiness,
          workspaceMembers,
          roleManagementLoading,
          roleManagementError,
        }}
      />
    </WorkspaceShell>
  );
}

export default function App(props: AppProps) {
  return (
    <AuthProvider
      config={props.authConfig ?? readDashboardAuthConfig()}
      client={props.authClient}
    >
      <WorkspaceAppShell />
    </AuthProvider>
  );
}
