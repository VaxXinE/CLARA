import type { AuthContext } from "../auth/auth-context";
import type { ExtensionSnapshot } from "../extension/extension-snapshot-types";
import type { WorkspaceScope } from "../workspace/workspace-scope";

export type ExtensionSnapshotAiContextBudget = {
  maxMessages: number;
  maxMessageChars: number;
};

export type BuildExtensionSnapshotAiContextInput = {
  authContext: AuthContext;
  scope: WorkspaceScope;
  snapshot: ExtensionSnapshot;
  budget?: Partial<ExtensionSnapshotAiContextBudget>;
  clientWorkspaceId?: string | null;
};

export type ExtensionSnapshotAiContextMessage = {
  id: string;
  direction: "incoming" | "outgoing";
  author: string | null;
  text: string;
  untrustedText: string;
  promptInjectionIntent: string | null;
  timestampLabel: string | null;
};

export type ExtensionSnapshotAiReadyContext = {
  policyVersion: "p17-extension-snapshot-ai-context-v1";
  organizationId: string;
  workspaceId: string;
  userId: string;
  provider: "extension";
  officialApi: false;
  channel: ExtensionSnapshot["channel"];
  snapshotHash: string;
  capturedAt: string;
  chatTitle: string;
  chatSubtitle: string | null;
  sourceUrlOrigin: string | null;
  messages: ExtensionSnapshotAiContextMessage[];
  contextBudgetSummary: {
    maxMessages: number;
    maxMessageChars: number;
    includedMessages: number;
    truncatedMessages: number;
  };
};
