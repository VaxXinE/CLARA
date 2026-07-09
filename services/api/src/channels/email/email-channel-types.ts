export const emailChannelModes = ["disabled", "simulated"] as const;

export type EmailChannelMode = (typeof emailChannelModes)[number];

export const allowlistedEmailHeaders = [
  "message-id",
  "in-reply-to",
  "references",
  "reply-to",
] as const;

export type AllowlistedEmailHeader = (typeof allowlistedEmailHeaders)[number];

export type EmailHeaderMap = Partial<Record<AllowlistedEmailHeader, string>>;

export type NormalizedInboundEmailMessage = {
  provider: string;
  providerMessageId: string;
  threadId: string | null;
  fromEmail: string;
  fromName: string | null;
  toEmail: string;
  subject: string;
  textBody: string;
  htmlBodyPresent: boolean;
  receivedAt: Date;
  headers: EmailHeaderMap;
  attachmentsPresent: boolean;
};

export type ClaraInboundChannelMessage = {
  channel: "email";
  provider: string;
  externalMessageId: string;
  externalThreadId: string | null;
  customerIdentifier: string;
  customerDisplayName: string | null;
  destinationIdentifier: string;
  subject: string;
  bodyText: string;
  htmlBodyPresent: boolean;
  attachmentsPresent: boolean;
  receivedAt: Date;
  metadata: {
    headers: EmailHeaderMap;
  };
};

export type SimulatedInboundEmailPayload = {
  providerMessageId?: string;
  threadId?: string | null;
  fromEmail: string;
  fromName?: string | null;
  toEmail: string;
  subject?: string;
  textBody?: string;
  htmlBody?: string | null;
  receivedAt?: string | Date;
  headers?: Record<string, string | undefined>;
  attachments?: Array<{
    filename: string;
  }>;
};
