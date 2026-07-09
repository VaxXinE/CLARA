import { ValidationError } from "../../errors/app-error";
import {
  allowlistedEmailHeaders,
  type ClaraInboundChannelMessage,
  type EmailHeaderMap,
  type NormalizedInboundEmailMessage,
  type SimulatedInboundEmailPayload,
} from "./email-channel-types";

const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function normalizeWhitespace(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

function normalizeSingleLine(value: string): string {
  return normalizeWhitespace(value).replace(/\s+/g, " ");
}

function normalizeOptionalName(value?: string | null): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = normalizeSingleLine(value);

  return normalized.length > 0 ? normalized : null;
}

function normalizeEmailAddress(value: string, fieldName: string): string {
  const normalized = normalizeSingleLine(value).toLowerCase();

  if (!basicEmailPattern.test(normalized)) {
    throw new ValidationError(`${fieldName} must be a valid email address.`);
  }

  return normalized;
}

function normalizeMessageId(value?: string): string {
  const normalized = normalizeSingleLine(value ?? "");

  if (normalized.length === 0) {
    throw new ValidationError("providerMessageId is required.");
  }

  return normalized;
}

function normalizeThreadId(value?: string | null): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = normalizeSingleLine(value);

  return normalized.length > 0 ? normalized : null;
}

function normalizeSubject(value?: string): string {
  return normalizeSingleLine(value ?? "");
}

function normalizeTextBody(value?: string): string {
  return normalizeWhitespace(value ?? "");
}

function normalizeReceivedAt(value?: string | Date): Date {
  if (!value) {
    return new Date();
  }

  const parsed = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError("receivedAt must be a valid date.");
  }

  return parsed;
}

function normalizeHeaders(
  headers?: Record<string, string | undefined>,
): EmailHeaderMap {
  const normalized: EmailHeaderMap = {};

  if (!headers) {
    return normalized;
  }

  for (const headerName of allowlistedEmailHeaders) {
    const rawValue =
      headers[headerName] ?? headers[headerName.toLowerCase()] ?? undefined;

    if (!rawValue) {
      continue;
    }

    const sanitized = normalizeSingleLine(rawValue);

    if (sanitized.length > 0) {
      normalized[headerName] = sanitized;
    }
  }

  return normalized;
}

export function normalizeInboundEmailPayload(
  input: SimulatedInboundEmailPayload,
  provider = "simulated-email",
): NormalizedInboundEmailMessage {
  const textBody = normalizeTextBody(input.textBody);
  const htmlBodyPresent = normalizeWhitespace(input.htmlBody ?? "").length > 0;

  return {
    provider,
    providerMessageId: normalizeMessageId(input.providerMessageId),
    threadId: normalizeThreadId(input.threadId),
    fromEmail: normalizeEmailAddress(input.fromEmail, "fromEmail"),
    fromName: normalizeOptionalName(input.fromName),
    toEmail: normalizeEmailAddress(input.toEmail, "toEmail"),
    subject: normalizeSubject(input.subject),
    textBody,
    htmlBodyPresent,
    receivedAt: normalizeReceivedAt(input.receivedAt),
    headers: normalizeHeaders(input.headers),
    attachmentsPresent: (input.attachments?.length ?? 0) > 0,
  };
}

export function toClaraInboundChannelMessage(
  input: NormalizedInboundEmailMessage,
): ClaraInboundChannelMessage {
  return {
    channel: "email",
    provider: input.provider,
    externalMessageId: input.providerMessageId,
    externalThreadId: input.threadId,
    customerIdentifier: input.fromEmail,
    customerDisplayName: input.fromName,
    destinationIdentifier: input.toEmail,
    subject: input.subject,
    bodyText: input.textBody,
    htmlBodyPresent: input.htmlBodyPresent,
    attachmentsPresent: input.attachmentsPresent,
    receivedAt: input.receivedAt,
    metadata: {
      headers: input.headers,
    },
  };
}
