import type { AuthContext } from "../auth/auth-context";

export type AiContextTaskType =
  | "conversation_summary"
  | "reply_suggestion"
  | "tone_rewrite"
  | "follow_up_suggestion"
  | "customer_note_summary"
  | "operator_coaching";

export type AiContextMessageInput = {
  id: string;
  direction: string;
  senderType: string;
  body: string;
  sentAt?: string;
};

export type AiContextBuilderInput = {
  authContext: AuthContext | null;
  taskType: AiContextTaskType;
  conversation: {
    id: string;
    organizationId: string;
    workspaceId: string;
    source: string;
    status?: string;
    customerId?: string | null;
  };
  customer?: {
    id: string;
    organizationId: string;
    workspaceId: string;
    displayName?: string | null;
    notesSummary?: string | null;
  } | null;
  recentMessages: AiContextMessageInput[];
  channelHealth?: {
    provider?: string;
    status?: string;
    reasonCode?: string | null;
  } | null;
  optionalKnowledgeSnippets?: string[];
};

export type AiUntrustedContentBlock = {
  kind: "customer_message" | "knowledge_snippet" | "customer_note";
  text: string;
};

export type AiContextBudgetSummary = {
  maxMessages: number;
  maxMessageChars: number;
  maxSnippetChars: number;
  includedMessages: number;
  truncatedMessages: number;
  includedSnippets: number;
  truncatedSnippets: number;
};

export type SafeAiContext = {
  policyVersion: "p7-ai-context-v1";
  workspaceId: string;
  userId: string;
  taskType: AiContextTaskType;
  conversationId: string;
  customerId: string | null;
  channel: string;
  customerDisplayName: string | null;
  recentMessages: Array<{
    id: string;
    direction: string;
    senderType: string;
    body: string;
    sentAt: string | null;
  }>;
  safeChannelStatus: {
    provider: string | null;
    status: string | null;
    reasonCode: string | null;
  };
  customerNotes: string | null;
  knowledgeSnippets: string[];
  untrustedContent: AiUntrustedContentBlock[];
  contextBudgetSummary: AiContextBudgetSummary;
};
