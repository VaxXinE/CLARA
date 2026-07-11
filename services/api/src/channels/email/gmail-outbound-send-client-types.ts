export type GmailOutboundSendClientCommand = {
  organizationId: string;
  workspaceId: string;
  providerAccountId: string;
  to: string[];
  subject: string;
  textBody: string;
  conversationId: string | null;
  idempotencyKey: string | null;
  correlationId: string | null;
};

export type GmailOutboundSendClientResult = {
  status: "sent" | "simulated";
  providerMessageId: string;
  sentAt: Date;
};

export interface GmailOutboundSendClient {
  send(
    command: GmailOutboundSendClientCommand,
  ): Promise<GmailOutboundSendClientResult>;
}
