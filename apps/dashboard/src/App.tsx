import { useDeferredValue, useEffect, useState, startTransition } from "react";
import { ApiClient, ApiClientError } from "./api/client";
import type {
  ActivityResponse,
  AiDraftResponse,
  ConversationDetailResponse,
  ConversationListResponse,
  CustomerProfileResponse,
  DemoAuthProfile,
  DemoRole,
  MeResponse,
} from "./api/types";
import { CustomerSidebar } from "./components/CustomerSidebar";
import { ConversationPane } from "./components/ConversationPane";
import { InboxPanel } from "./components/InboxPanel";
import { RoleSwitcher } from "./components/RoleSwitcher";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://127.0.0.1:3000";
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== "false";
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

function readStoredRole(): DemoRole {
  const fallback: DemoRole = "agent";

  if (!DEMO_MODE || typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(ROLE_STORAGE_KEY);

  if (raw === "owner" || raw === "agent" || raw === "viewer") {
    return raw;
  }

  return fallback;
}

function buildClient(role: DemoRole): ApiClient {
  return new ApiClient({
    baseUrl: API_BASE_URL,
    demoAuthProfile: DEMO_MODE ? demoProfiles[role] : undefined,
  });
}

function toSafeMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError) {
    return `${error.message} Reference: ${error.correlationId}`;
  }

  return fallback;
}

export default function App() {
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
  const [activityItems, setActivityItems] = useState<
    ActivityResponse["data"]["items"]
  >([]);
  const [composerValue, setComposerValue] = useState("");
  const [draftId, setDraftId] = useState<string | null>(null);
  const [aiDraftLabel, setAiDraftLabel] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const [shellError, setShellError] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [composerError, setComposerError] = useState<string | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);

  useEffect(() => {
    if (!DEMO_MODE || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(ROLE_STORAGE_KEY, selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    let cancelled = false;

    async function loadShell() {
      const client = buildClient(selectedRole);
      setShellError(null);
      setListError(null);
      setListLoading(true);
      setSelectedConversationId(null);
      setConversationDetail(null);
      setCustomer(null);
      setActivityItems([]);
      setComposerValue("");
      setDraftId(null);
      setAiDraftLabel(null);

      try {
        const [meResponse, listResponse] = await Promise.all([
          client.getMe(),
          client.listConversations({
            limit: 20,
            status: statusFilter || undefined,
            search: deferredSearch || undefined,
          }),
        ]);

        if (cancelled) {
          return;
        }

        setMe(meResponse);
        setConversations(listResponse.data);
        setConversationPermissions(listResponse.permissions);

        startTransition(() => {
          setSelectedConversationId(listResponse.data[0]?.id ?? null);
        });
      } catch (error) {
        if (cancelled) {
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
  }, [deferredSearch, selectedRole, statusFilter]);

  useEffect(() => {
    if (!selectedConversationId) {
      setConversationDetail(null);
      setCustomer(null);
      setActivityItems([]);
      return;
    }

    const conversationId = selectedConversationId;
    let cancelled = false;

    async function loadConversationWorkspace() {
      const client = buildClient(selectedRole);
      setDetailLoading(true);
      setDetailError(null);
      setActivityLoading(true);
      setActivityError(null);
      setCustomerLoading(true);
      setCustomerError(null);
      setComposerError(null);
      setDraftId(null);
      setAiDraftLabel(null);
      setComposerValue("");

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

        const customerResponse = await client.getCustomer(
          detailResponse.conversation.customer.id,
        );

        if (cancelled) {
          return;
        }

        setCustomer(customerResponse.customer);
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
      } finally {
        if (!cancelled) {
          setDetailLoading(false);
          setActivityLoading(false);
          setCustomerLoading(false);
        }
      }
    }

    void loadConversationWorkspace();

    return () => {
      cancelled = true;
    };
  }, [selectedConversationId, selectedRole]);

  const canGenerateDraft =
    conversationPermissions?.can_generate_ai_draft === true &&
    Boolean(conversationDetail);
  const canSendReply =
    conversationPermissions?.can_send_reply === true &&
    Boolean(conversationDetail);

  async function refreshConversationWorkspace(conversationId: string) {
    const client = buildClient(selectedRole);
    const [listResponse, detailResponse, activityResponse] = await Promise.all([
      client.listConversations({
        limit: 20,
        status: statusFilter || undefined,
        search: deferredSearch || undefined,
      }),
      client.getConversation(conversationId),
      client.getActivity(conversationId),
    ]);
    const customerResponse = await client.getCustomer(
      detailResponse.conversation.customer.id,
    );

    setConversations(listResponse.data);
    setConversationPermissions(detailResponse.permissions);
    setConversationDetail(detailResponse.conversation);
    setActivityItems(activityResponse.data.items);
    setCustomer(customerResponse.customer);
  }

  async function handleGenerateDraft() {
    if (!selectedConversationId || !canGenerateDraft) {
      return;
    }

    const client = buildClient(selectedRole);
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

  async function handleSendReply() {
    if (!selectedConversationId || !canSendReply) {
      return;
    }

    const client = buildClient(selectedRole);
    setIsSendingReply(true);
    setComposerError(null);

    try {
      await client.sendReply(selectedConversationId, {
        body: composerValue,
        draft_id: draftId ?? undefined,
      });
      setComposerValue("");
      setDraftId(null);
      setAiDraftLabel(null);
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

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">CLARA Workspace</p>
          <h1>Conversation workspace</h1>
        </div>

        <div className="topbar-meta">
          {DEMO_MODE ? (
            <div className="meta-cluster">
              <span className="environment-badge">Demo auth</span>
              <RoleSwitcher
                profiles={demoProfiles}
                value={selectedRole}
                onChange={setSelectedRole}
              />
            </div>
          ) : null}

          <div className="meta-cluster">
            <span className="workspace-pill">
              Workspace: {me?.workspace.id ?? "loading"}
            </span>
            <span className="workspace-pill">
              User: {me?.user.id ?? "loading"} ({me?.user.role ?? "..."})
            </span>
          </div>
        </div>
      </header>

      {shellError ? (
        <div className="global-alert">
          <strong>Something went wrong.</strong>
          <p>{shellError}</p>
        </div>
      ) : null}

      <main className="workspace-grid">
        <InboxPanel
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          statusFilter={statusFilter}
          search={search}
          loading={listLoading}
          error={listError}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          onSelectConversation={(conversationId) =>
            startTransition(() => {
              setSelectedConversationId(conversationId);
            })
          }
        />

        <ConversationPane
          conversation={conversationDetail}
          loading={detailLoading}
          error={detailError}
          composerValue={composerValue}
          onComposerChange={setComposerValue}
          onGenerateDraft={handleGenerateDraft}
          onSendReply={handleSendReply}
          canGenerateDraft={canGenerateDraft}
          canSendReply={canSendReply}
          isGeneratingDraft={isGeneratingDraft}
          isSendingReply={isSendingReply}
          composerError={composerError}
          aiDraftLabel={aiDraftLabel}
          readOnlyMessage={
            me?.user.role === "viewer"
              ? "You have view-only access to this conversation."
              : null
          }
        />

        <CustomerSidebar
          customer={customer}
          customerLoading={customerLoading}
          customerError={customerError}
          activity={activityItems}
          activityLoading={activityLoading}
          activityError={activityError}
        />
      </main>
    </div>
  );
}
