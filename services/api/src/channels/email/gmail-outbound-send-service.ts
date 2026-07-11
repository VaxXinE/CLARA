import { assertPermission } from "../../auth/permissions";
import { AppError, ValidationError } from "../../errors/app-error";
import type { GmailOutboundSendClient } from "./gmail-outbound-send-client-types";
import {
  GMAIL_OUTBOUND_DEFAULT_SUBJECT,
  GMAIL_OUTBOUND_MAX_BODY_LENGTH,
  GMAIL_OUTBOUND_MAX_RECIPIENTS,
  GMAIL_OUTBOUND_MAX_SUBJECT_LENGTH,
  type GmailOutboundSendMessageInput,
  type GmailOutboundSendResultDto,
  type GmailOutboundSendServiceInput,
} from "./gmail-outbound-send-service-types";

const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const messageInputKeys = new Set([
  "providerAccountId",
  "conversationId",
  "to",
  "subject",
  "textBody",
  "idempotencyKey",
  "correlationId",
]);

function normalizeSingleLine(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeText(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

function normalizeOptionalText(
  value: string | null | undefined,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = normalizeSingleLine(value);

  return normalized.length > 0 ? normalized : null;
}

function assertNoUnsupportedFields(input: GmailOutboundSendMessageInput): void {
  for (const key of Object.keys(input)) {
    if (!messageInputKeys.has(key)) {
      throw new ValidationError("Unsupported Gmail outbound send field.");
    }
  }
}

function normalizeRecipients(value: string[]): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ValidationError("At least one recipient is required.");
  }

  if (value.length > GMAIL_OUTBOUND_MAX_RECIPIENTS) {
    throw new ValidationError("Too many Gmail outbound recipients.");
  }

  const recipients = [
    ...new Set(value.map((item) => normalizeSingleLine(item).toLowerCase())),
  ];

  if (
    recipients.length === 0 ||
    recipients.some((recipient) => !basicEmailPattern.test(recipient))
  ) {
    throw new ValidationError(
      "Gmail outbound recipient must be a valid email address.",
    );
  }

  return recipients;
}

function normalizeSubject(value: string | null | undefined): string {
  const subject =
    normalizeOptionalText(value) ?? GMAIL_OUTBOUND_DEFAULT_SUBJECT;

  if (subject.length > GMAIL_OUTBOUND_MAX_SUBJECT_LENGTH) {
    throw new ValidationError(
      "Gmail outbound subject exceeds the maximum length.",
    );
  }

  return subject;
}

function normalizeBody(value: string): string {
  const body = normalizeText(value);

  if (body.length === 0) {
    throw new ValidationError("Gmail outbound body cannot be empty.");
  }

  if (body.length > GMAIL_OUTBOUND_MAX_BODY_LENGTH) {
    throw new ValidationError(
      "Gmail outbound body exceeds the maximum length.",
    );
  }

  return body;
}

export class GmailOutboundSendService {
  constructor(private readonly client: GmailOutboundSendClient) {}

  async send(
    input: GmailOutboundSendServiceInput,
  ): Promise<GmailOutboundSendResultDto> {
    assertPermission(input.actor.role, "reply:send");
    assertNoUnsupportedFields(input.message);

    const providerAccountId = normalizeSingleLine(
      input.message.providerAccountId,
    );

    if (providerAccountId.length === 0) {
      throw new ValidationError("Gmail provider account is required.");
    }

    const command = {
      organizationId: input.actor.organizationId,
      workspaceId: input.actor.workspaceId,
      providerAccountId,
      to: normalizeRecipients(input.message.to),
      subject: normalizeSubject(input.message.subject),
      textBody: normalizeBody(input.message.textBody),
      conversationId: normalizeOptionalText(input.message.conversationId),
      idempotencyKey: normalizeOptionalText(input.message.idempotencyKey),
      correlationId: normalizeOptionalText(input.message.correlationId),
    };

    try {
      const result = await this.client.send(command);

      return {
        status: result.status,
        provider: "gmail",
        provider_message_id: result.providerMessageId,
        ...(result.status === "simulated"
          ? { reason_code: "simulated_send_completed" as const }
          : {}),
        sent_at: result.sentAt.toISOString(),
        ...(command.correlationId
          ? { correlation_id: command.correlationId }
          : {}),
      };
    } catch (error) {
      if (error instanceof AppError && error.statusCode < 500) {
        throw error;
      }

      return {
        status: "failed",
        provider: "gmail",
        reason_code: "provider_send_failed",
        ...(command.correlationId
          ? { correlation_id: command.correlationId }
          : {}),
      };
    }
  }
}
