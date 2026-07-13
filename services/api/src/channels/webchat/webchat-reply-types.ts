import type { WorkspaceScope } from "../../workspace/workspace-scope";

export type WebchatReplyCommand = {
  scope: WorkspaceScope;
  channelAccountId: string;
  conversationId: string;
  body: string;
  correlationId: string;
};

export type WebchatReplyResult = {
  provider: "webchat";
  status: "simulated" | "sent" | "failed" | "skipped";
  providerMessageId: string | null;
  reasonCode: string | null;
  sentAt: Date | null;
};
