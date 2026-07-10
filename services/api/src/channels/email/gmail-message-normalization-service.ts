import { ValidationError } from "../../errors/app-error";
import type { GmailProviderAccount } from "./gmail-auth-types";
import type {
  GmailInboundHeaderDto,
  GmailInboundMessageDto,
  GmailInboundPayloadMetadataDto,
} from "./gmail-inbound-message-fetch-types";
import type { EmailHeaderMap } from "./email-channel-types";
import type { GmailNormalizedInboundEmailEnvelope } from "./gmail-message-normalization-types";

const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function normalizeWhitespace(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

function normalizeSingleLine(value: string): string {
  return normalizeWhitespace(value).replace(/\s+/g, " ");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toHeaderMap(
  headers: GmailInboundHeaderDto[] | undefined,
): Record<string, string> {
  const map: Record<string, string> = {};

  for (const header of headers ?? []) {
    const key = header.name.trim().toLowerCase();

    if (key.length === 0 || map[key]) {
      continue;
    }

    map[key] = normalizeSingleLine(header.value);
  }

  return map;
}

function extractEmailAddresses(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  const matches = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];

  return [...new Set(matches.map((email) => email.toLowerCase()))];
}

function parseMailbox(value: string | undefined): {
  email: string;
  name: string | null;
} | null {
  const addresses = extractEmailAddresses(value);
  const email = addresses[0];

  if (!email || !basicEmailPattern.test(email)) {
    return null;
  }

  const raw = normalizeSingleLine(value ?? "");
  const withoutAngleAddress = raw.replace(
    new RegExp(`<\\s*${escapeRegExp(email)}\\s*>`, "i"),
    "",
  );
  const withoutAddress = withoutAngleAddress
    .replace(new RegExp(escapeRegExp(email), "i"), "")
    .trim()
    .replace(/^["'\s]+|["'\s]+$/g, "");

  return {
    email,
    name: withoutAddress.length > 0 ? withoutAddress : null,
  };
}

function parseReceivedAt(
  dateHeader: string | undefined,
  internalDate: string | undefined,
  now: Date,
): Date {
  if (dateHeader) {
    const parsedDate = new Date(dateHeader);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  if (internalDate) {
    const millis = Number(internalDate);

    if (Number.isFinite(millis)) {
      const parsedDate = new Date(millis);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  }

  return now;
}

function hasHtmlPart(
  payload: GmailInboundPayloadMetadataDto | undefined,
): boolean {
  if (!payload) {
    return false;
  }

  if (payload.mime_type?.toLowerCase() === "text/html") {
    return true;
  }

  return (payload.parts ?? []).some((part) => hasHtmlPart(part));
}

function hasAttachmentPart(
  payload: GmailInboundPayloadMetadataDto | undefined,
): boolean {
  if (!payload) {
    return false;
  }

  if (
    normalizeSingleLine(payload.filename ?? "").length > 0 ||
    normalizeSingleLine(payload.attachment_id ?? "").length > 0
  ) {
    return true;
  }

  return (payload.parts ?? []).some((part) => hasAttachmentPart(part));
}

function toAllowlistedHeaders(headers: Record<string, string>): EmailHeaderMap {
  const allowlisted: EmailHeaderMap = {};

  if (headers["message-id"]) {
    allowlisted["message-id"] = headers["message-id"];
  }

  if (headers["in-reply-to"]) {
    allowlisted["in-reply-to"] = headers["in-reply-to"];
  }

  if (headers.references) {
    allowlisted.references = headers.references;
  }

  if (headers["reply-to"]) {
    allowlisted["reply-to"] = headers["reply-to"];
  }

  return allowlisted;
}

export class GmailMessageNormalizationService {
  normalizeMessage(input: {
    account: Pick<GmailProviderAccount, "id" | "emailAddress">;
    message: GmailInboundMessageDto;
    now?: Date;
  }): GmailNormalizedInboundEmailEnvelope {
    const now = input.now ?? new Date();
    const headerMap = toHeaderMap(input.message.payload?.headers);
    const from = parseMailbox(headerMap.from);
    const to =
      extractEmailAddresses(headerMap.to)[0] ?? input.account.emailAddress;

    if (!from) {
      throw new ValidationError(
        "Gmail message is missing a valid From header.",
      );
    }

    if (!basicEmailPattern.test(to)) {
      throw new ValidationError("Gmail message is missing a valid To header.");
    }

    const providerMessageId = normalizeSingleLine(
      input.message.provider_message_id,
    );
    const providerThreadId = input.message.thread_id
      ? normalizeSingleLine(input.message.thread_id)
      : null;

    return {
      provider: "gmail",
      provider_account_id: input.account.id,
      provider_message_id: providerMessageId,
      provider_thread_id: providerThreadId,
      message_id: headerMap["message-id"] ?? null,
      in_reply_to: headerMap["in-reply-to"] ?? null,
      references: headerMap.references ?? null,
      snippet: input.message.snippet
        ? normalizeSingleLine(input.message.snippet)
        : null,
      label_ids: [...input.message.label_ids],
      cc: extractEmailAddresses(headerMap.cc),
      bcc: extractEmailAddresses(headerMap.bcc),
      email: {
        provider: "gmail",
        providerMessageId,
        threadId: providerThreadId,
        fromEmail: from.email,
        fromName: from.name,
        toEmail: to.toLowerCase(),
        subject: normalizeSingleLine(headerMap.subject ?? ""),
        textBody: normalizeWhitespace(input.message.snippet ?? ""),
        htmlBodyPresent: hasHtmlPart(input.message.payload),
        receivedAt: parseReceivedAt(
          headerMap.date,
          input.message.internal_date,
          now,
        ),
        headers: toAllowlistedHeaders(headerMap),
        attachmentsPresent: hasAttachmentPart(input.message.payload),
      },
    };
  }
}
