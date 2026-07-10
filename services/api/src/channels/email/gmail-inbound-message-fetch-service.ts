import { AppError, ValidationError } from "../../errors/app-error";
import type { GmailApiClient } from "./gmail-api-client";
import type { GmailApiAccessTokenProvider } from "./gmail-api-client-types";
import type {
  GmailGetMessageInput,
  GmailInboundAllowedHeaderName,
  GmailInboundHeaderDto,
  GmailInboundMessageDto,
  GmailInboundMessageFormat,
  GmailInboundMessageListItemDto,
  GmailInboundMessageListResponseDto,
  GmailInboundPayloadMetadataDto,
  GmailListMessagesInput,
  GmailListMessagesResponse,
  GmailMessageHeaderResponse,
  GmailMessagePartResponse,
  GmailMessageResponse,
} from "./gmail-inbound-message-fetch-types";

const MAX_RESULTS_DEFAULT = 25;
const MAX_RESULTS_LIMIT = 100;
const PAGE_TOKEN_MAX_LENGTH = 512;
const QUERY_MAX_LENGTH = 256;
const PROVIDER_MESSAGE_ID_PATTERN = /^[a-zA-Z0-9_-]{1,256}$/;
const PAGE_TOKEN_PATTERN = /^[a-zA-Z0-9._~-]{1,512}$/;
const SAFE_QUERY_PATTERN = /^[a-zA-Z0-9\s@._:+\-"'()/]+$/;
const ALLOWED_LABEL_IDS = new Set([
  "INBOX",
  "UNREAD",
  "STARRED",
  "IMPORTANT",
  "SENT",
  "DRAFT",
  "CATEGORY_PERSONAL",
  "CATEGORY_SOCIAL",
  "CATEGORY_PROMOTIONS",
  "CATEGORY_UPDATES",
  "CATEGORY_FORUMS",
]);
const ALLOWED_HEADERS = new Set<GmailInboundAllowedHeaderName>([
  "From",
  "To",
  "Cc",
  "Bcc",
  "Subject",
  "Date",
  "Message-ID",
  "In-Reply-To",
  "References",
]);

function normalizeSafeString(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function clampMaxResults(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) {
    return MAX_RESULTS_DEFAULT;
  }

  return Math.min(Math.max(Math.trunc(value), 1), MAX_RESULTS_LIMIT);
}

function validateQuery(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const query = normalizeSafeString(value);

  if (query.length === 0) {
    return undefined;
  }

  if (query.length > QUERY_MAX_LENGTH || !SAFE_QUERY_PATTERN.test(query)) {
    throw new ValidationError("Invalid request.", [
      {
        path: "query.q",
        message: "Invalid Gmail query.",
      },
    ]);
  }

  return query;
}

function validatePageToken(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const token = value.trim();

  if (token.length === 0) {
    return undefined;
  }

  if (token.length > PAGE_TOKEN_MAX_LENGTH || !PAGE_TOKEN_PATTERN.test(token)) {
    throw new ValidationError("Invalid request.", [
      {
        path: "query.pageToken",
        message: "Invalid Gmail page token.",
      },
    ]);
  }

  return token;
}

function validateLabelIds(value: string[] | undefined): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = [
    ...new Set(value.map((item) => item.trim()).filter(Boolean)),
  ];

  if (normalized.length === 0) {
    return undefined;
  }

  if (normalized.some((item) => !ALLOWED_LABEL_IDS.has(item))) {
    throw new ValidationError("Invalid request.", [
      {
        path: "query.labelIds",
        message: "Invalid Gmail label ID.",
      },
    ]);
  }

  return normalized;
}

function validateProviderMessageId(value: string): string {
  const id = value.trim();

  if (!PROVIDER_MESSAGE_ID_PATTERN.test(id)) {
    throw new ValidationError("Invalid request.", [
      {
        path: "params.providerMessageId",
        message: "Invalid Gmail provider message ID.",
      },
    ]);
  }

  return id;
}

function sanitizeHeader(
  header: GmailMessageHeaderResponse,
): GmailInboundHeaderDto | null {
  const name = typeof header.name === "string" ? header.name.trim() : "";
  const value =
    typeof header.value === "string" ? normalizeSafeString(header.value) : "";

  if (
    value.length === 0 ||
    !ALLOWED_HEADERS.has(name as GmailInboundAllowedHeaderName)
  ) {
    return null;
  }

  return {
    name: name as GmailInboundAllowedHeaderName,
    value,
  };
}

function sanitizePayload(
  payload: GmailMessagePartResponse | undefined,
): GmailInboundPayloadMetadataDto | undefined {
  if (!payload) {
    return undefined;
  }

  const headers = (payload.headers ?? [])
    .map((header) => sanitizeHeader(header))
    .filter((header): header is GmailInboundHeaderDto => header !== null);
  const parts = (payload.parts ?? [])
    .map((part) => sanitizePayload(part))
    .filter(
      (part): part is GmailInboundPayloadMetadataDto => part !== undefined,
    );

  const result: GmailInboundPayloadMetadataDto = {
    headers,
  };

  if (typeof payload.partId === "string" && payload.partId.trim().length > 0) {
    result.part_id = payload.partId.trim();
  }

  if (
    typeof payload.mimeType === "string" &&
    payload.mimeType.trim().length > 0
  ) {
    result.mime_type = payload.mimeType.trim();
  }

  if (
    typeof payload.filename === "string" &&
    payload.filename.trim().length > 0
  ) {
    result.filename = payload.filename.trim();
  }

  if (
    typeof payload.body?.size === "number" &&
    Number.isFinite(payload.body.size) &&
    payload.body.size >= 0
  ) {
    result.body_size = payload.body.size;
  }

  if (
    typeof payload.body?.attachmentId === "string" &&
    payload.body.attachmentId.trim().length > 0
  ) {
    result.attachment_id = payload.body.attachmentId.trim();
  }

  if (parts.length > 0) {
    result.parts = parts;
  }

  return result;
}

function sanitizeInternalDate(value: string | undefined): string | undefined {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  const epochMs = Number(value);

  if (!Number.isFinite(epochMs) || epochMs < 0) {
    return undefined;
  }

  return new Date(epochMs).toISOString();
}

function sanitizeListItem(
  message: GmailMessageResponse | { id?: string; threadId?: string },
): GmailInboundMessageListItemDto | null {
  const id = typeof message.id === "string" ? message.id.trim() : "";
  const typedMessage = message as GmailMessageResponse;

  if (!PROVIDER_MESSAGE_ID_PATTERN.test(id)) {
    return null;
  }

  const result: GmailInboundMessageListItemDto = {
    provider_message_id: id,
    label_ids: Array.isArray(typedMessage.labelIds)
      ? [...new Set(typedMessage.labelIds.filter(Boolean))]
      : [],
  };

  if (
    typeof message.threadId === "string" &&
    message.threadId.trim().length > 0
  ) {
    result.thread_id = message.threadId.trim();
  }

  const snippet =
    typeof typedMessage.snippet === "string" ? typedMessage.snippet.trim() : "";

  if (snippet.length > 0) {
    result.snippet = normalizeSafeString(snippet);
  }

  const internalDate = sanitizeInternalDate(typedMessage.internalDate);

  if (internalDate) {
    result.internal_date = internalDate;
  }

  return result;
}

function sanitizeMessage(
  message: GmailMessageResponse,
): GmailInboundMessageDto {
  const base = sanitizeListItem(message);

  if (!base) {
    throw new AppError({
      statusCode: 502,
      appCode: "GMAIL_INBOUND_INVALID_RESPONSE",
      message: "Gmail inbound message fetch failed.",
    });
  }

  const payload = sanitizePayload(message.payload);

  return payload
    ? {
        ...base,
        payload,
      }
    : base;
}

function sanitizeApiError(error: unknown): AppError {
  if (error instanceof ValidationError || error instanceof AppError) {
    return error;
  }

  if (error instanceof Error && "code" in error) {
    const code =
      typeof (error as { code?: unknown }).code === "string"
        ? (error as { code: string }).code
        : "gmail_api_http_error";

    const message =
      code === "gmail_api_timeout"
        ? "Gmail inbound message fetch timed out."
        : code === "gmail_api_invalid_response"
          ? "Gmail inbound message fetch failed."
          : code === "gmail_api_missing_token"
            ? "Gmail API access token is required."
            : "Gmail inbound message fetch failed.";

    return new AppError({
      statusCode: code === "gmail_api_missing_token" ? 409 : 502,
      appCode: "GMAIL_INBOUND_FETCH_FAILED",
      message,
    });
  }

  return new AppError({
    statusCode: 502,
    appCode: "GMAIL_INBOUND_FETCH_FAILED",
    message: "Gmail inbound message fetch failed.",
  });
}

export class GmailInboundMessageFetchService {
  constructor(
    private readonly tokens: GmailApiAccessTokenProvider,
    private readonly gmailApiClient: GmailApiClient,
  ) {}

  async listMessages(
    input: GmailListMessagesInput,
  ): Promise<GmailInboundMessageListResponseDto> {
    const maxResults = clampMaxResults(input.maxResults);
    const pageToken = validatePageToken(input.pageToken);
    const query = validateQuery(input.query);
    const labelIds = validateLabelIds(input.labelIds);
    const accessToken = await this.tokens.getAccessToken({
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      ...(input.now ? { now: input.now } : {}),
    });

    try {
      const response =
        await this.gmailApiClient.requestJson<GmailListMessagesResponse>({
          accessToken,
          method: "GET",
          path: "/gmail/v1/users/me/messages",
          query: {
            maxResults,
            ...(pageToken ? { pageToken } : {}),
            ...(query ? { q: query } : {}),
            ...(labelIds ? { labelIds } : {}),
          },
        });

      return {
        items: (response.messages ?? [])
          .map((message) => sanitizeListItem(message))
          .filter(
            (message): message is GmailInboundMessageListItemDto =>
              message !== null,
          ),
        ...(typeof response.nextPageToken === "string" &&
        response.nextPageToken.trim().length > 0
          ? {
              next_page_token: response.nextPageToken.trim(),
            }
          : {}),
      };
    } catch (error) {
      throw sanitizeApiError(error);
    }
  }

  async getMessage(
    input: GmailGetMessageInput,
  ): Promise<GmailInboundMessageDto> {
    const accessToken = await this.tokens.getAccessToken({
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      ...(input.now ? { now: input.now } : {}),
    });

    try {
      const response =
        await this.gmailApiClient.requestJson<GmailMessageResponse>({
          accessToken,
          method: "GET",
          path: `/gmail/v1/users/me/messages/${validateProviderMessageId(
            input.providerMessageId,
          )}`,
          query: {
            format: (input.format ?? "full") as GmailInboundMessageFormat,
          },
        });

      return sanitizeMessage(response);
    } catch (error) {
      throw sanitizeApiError(error);
    }
  }
}
