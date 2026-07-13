import type { AuthContext } from "../auth/auth-context";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type { ExtensionBridgeChannel } from "./extension-bridge-types";

export type ExtensionSnapshotMessage = {
  id: string;
  direction: "incoming" | "outgoing";
  author: string | null;
  text: string;
  timestampLabel: string | null;
  replyContextText: string | null;
};

export type ExtensionSnapshot = {
  provider: "extension";
  officialApi: false;
  channel: ExtensionBridgeChannel;
  capturedAt: Date;
  snapshotHash: string;
  chatTitle: string;
  chatSubtitle: string | null;
  sourceUrlOrigin: string | null;
  messages: ExtensionSnapshotMessage[];
};

export type PersistExtensionSnapshotInput = {
  auth: AuthContext;
  scope: WorkspaceScope;
  snapshot: ExtensionSnapshot;
  correlationId: string;
};

export type PersistExtensionSnapshotResult = {
  snapshotId: string;
  status: "accepted" | "duplicate";
  duplicate: boolean;
  channel: ExtensionBridgeChannel;
  snapshotHash: string;
  conversationFingerprint: string;
  conversationId: string;
  customerId: string;
  messageCount: number;
  persistedMessageCount: number;
  incomingCount: number;
  outgoingCount: number;
  capturedAt: Date;
};
