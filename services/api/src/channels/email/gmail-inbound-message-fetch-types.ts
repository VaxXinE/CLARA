export const gmailInboundMessageFormats = ["metadata", "full"] as const;

export type GmailInboundMessageFormat =
  (typeof gmailInboundMessageFormats)[number];

export type GmailInboundAllowedHeaderName =
  | "From"
  | "To"
  | "Cc"
  | "Bcc"
  | "Subject"
  | "Date"
  | "Message-ID"
  | "In-Reply-To"
  | "References";

export type GmailInboundHeaderDto = {
  name: GmailInboundAllowedHeaderName;
  value: string;
};

export type GmailInboundPayloadMetadataDto = {
  part_id?: string;
  mime_type?: string;
  filename?: string;
  headers: GmailInboundHeaderDto[];
  body_size?: number;
  attachment_id?: string;
  parts?: GmailInboundPayloadMetadataDto[];
};

export type GmailInboundMessageListItemDto = {
  provider_message_id: string;
  thread_id?: string;
  label_ids: string[];
  snippet?: string;
  internal_date?: string;
};

export type GmailInboundMessageDto = GmailInboundMessageListItemDto & {
  payload?: GmailInboundPayloadMetadataDto;
};

export type GmailInboundMessageListResponseDto = {
  items: GmailInboundMessageListItemDto[];
  next_page_token?: string;
};

export type GmailListMessagesInput = {
  organizationId: string;
  workspaceId: string;
  accountId: string;
  maxResults?: number;
  pageToken?: string;
  query?: string;
  labelIds?: string[];
  now?: Date;
};

export type GmailGetMessageInput = {
  organizationId: string;
  workspaceId: string;
  accountId: string;
  providerMessageId: string;
  format?: GmailInboundMessageFormat;
  now?: Date;
};

export type GmailMessageHeaderResponse = {
  name?: string;
  value?: string;
};

export type GmailMessageBodyResponse = {
  size?: number;
  attachmentId?: string;
  data?: string;
};

export type GmailMessagePartResponse = {
  partId?: string;
  mimeType?: string;
  filename?: string;
  headers?: GmailMessageHeaderResponse[];
  body?: GmailMessageBodyResponse;
  parts?: GmailMessagePartResponse[];
};

export type GmailMessageResponse = {
  id?: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  internalDate?: string;
  payload?: GmailMessagePartResponse;
};

export type GmailListMessagesResponse = {
  messages?: Array<{
    id?: string;
    threadId?: string;
  }>;
  nextPageToken?: string;
  resultSizeEstimate?: number;
};
