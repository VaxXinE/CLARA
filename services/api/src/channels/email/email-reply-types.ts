import { ValidationError } from "../../errors/app-error";

export const EMAIL_REPLY_MAX_BODY_LENGTH = 2_000;
export const EMAIL_REPLY_MAX_SUBJECT_LENGTH = 200;

const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export type EmailReplyCommand = {
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  customerId: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  textBody: string;
  providerThreadId?: string | null;
  idempotencyKey?: string;
};

export type EmailReplyResult = {
  status: "sent" | "simulated";
  providerMessageId: string;
  providerThreadId: string | null;
  sentAt: Date;
  metadata: {
    provider: string;
    transport: "simulated";
  };
};

function normalizeWhitespace(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

function normalizeSingleLine(value: string): string {
  return normalizeWhitespace(value).replace(/\s+/g, " ");
}

function validateEmailAddress(value: string, fieldName: string): string {
  const normalized = normalizeSingleLine(value).toLowerCase();

  if (!basicEmailPattern.test(normalized)) {
    throw new ValidationError(`${fieldName} must be a valid email address.`);
  }

  return normalized;
}

function validateOptionalSingleLine(
  value: string | undefined | null,
  fieldName: string,
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const normalized = normalizeSingleLine(value);

  if (normalized.length === 0) {
    return undefined;
  }

  if (
    fieldName === "subject" &&
    normalized.length > EMAIL_REPLY_MAX_SUBJECT_LENGTH
  ) {
    throw new ValidationError("subject exceeds the maximum length.");
  }

  return normalized;
}

function validateTextBody(value: string): string {
  const normalized = normalizeWhitespace(value);

  if (normalized.length === 0) {
    throw new ValidationError("textBody cannot be empty.");
  }

  if (normalized.length > EMAIL_REPLY_MAX_BODY_LENGTH) {
    throw new ValidationError("textBody exceeds the maximum length.");
  }

  return normalized;
}

export function validateEmailReplyCommand(
  input: EmailReplyCommand,
): EmailReplyCommand {
  const subject = validateOptionalSingleLine(input.subject, "subject") ?? "";
  const providerThreadId =
    validateOptionalSingleLine(input.providerThreadId, "providerThreadId") ??
    null;
  const idempotencyKey = validateOptionalSingleLine(
    input.idempotencyKey,
    "idempotencyKey",
  );

  const result: EmailReplyCommand = {
    organizationId: normalizeSingleLine(input.organizationId),
    workspaceId: normalizeSingleLine(input.workspaceId),
    conversationId: normalizeSingleLine(input.conversationId),
    customerId: normalizeSingleLine(input.customerId),
    fromEmail: validateEmailAddress(input.fromEmail, "fromEmail"),
    toEmail: validateEmailAddress(input.toEmail, "toEmail"),
    subject,
    textBody: validateTextBody(input.textBody),
    providerThreadId,
  };

  if (idempotencyKey) {
    result.idempotencyKey = idempotencyKey;
  }

  return result;
}
