import { ValidationError } from "../../errors/app-error";
import { WHATSAPP_MESSAGE_MAX_LENGTH } from "./whatsapp-webhook-types";
import type { WhatsappMessageNormalizationResult } from "./whatsapp-message-normalization-types";

type WhatsappTextMessage = {
  id?: unknown;
  from?: unknown;
  timestamp?: unknown;
  type?: unknown;
  text?: {
    body?: unknown;
  };
  context?: {
    id?: unknown;
  };
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export class WhatsappMessageNormalizationService {
  normalize(payload: unknown): WhatsappMessageNormalizationResult {
    const root = asRecord(payload);
    const entry = Array.isArray(root.entry) ? asRecord(root.entry[0]) : {};
    const change = Array.isArray(entry.changes)
      ? asRecord(entry.changes[0])
      : {};
    const value = asRecord(change.value);
    const metadata = asRecord(value.metadata);
    const messages = Array.isArray(value.messages) ? value.messages : [];
    const message = asRecord(messages[0]) as WhatsappTextMessage;
    const contacts = Array.isArray(value.contacts) ? value.contacts : [];
    const contact = asRecord(contacts[0]);
    const profile = asRecord(contact.profile);
    const phoneNumberId = asString(metadata.phone_number_id);
    const externalMessageId = asString(message.id);
    const senderExternalId = asString(message.from);
    const textBody = asString(message.text?.body);

    if (!phoneNumberId || !externalMessageId || !senderExternalId) {
      throw new ValidationError("Invalid WhatsApp webhook payload.");
    }

    if (message.type !== "text" || !textBody) {
      throw new ValidationError("Unsupported WhatsApp message type.");
    }

    if (textBody.length > WHATSAPP_MESSAGE_MAX_LENGTH) {
      throw new ValidationError(
        "WhatsApp message text exceeds the maximum length.",
      );
    }

    const timestampSeconds = Number(asString(message.timestamp) ?? "0");
    const receivedAt =
      Number.isFinite(timestampSeconds) && timestampSeconds > 0
        ? new Date(timestampSeconds * 1000)
        : new Date();

    return {
      phoneNumberId,
      message: {
        provider: "whatsapp",
        channelType: "messaging",
        externalMessageId,
        externalConversationId: asString(message.context?.id),
        senderExternalId,
        senderDisplayName: asString(profile.name)?.slice(0, 120) ?? null,
        messageText: textBody,
        receivedAt,
        metadata: {
          phone_number_id: phoneNumberId,
          ...(asString(metadata.display_phone_number)
            ? { display_phone_number: asString(metadata.display_phone_number)! }
            : {}),
        },
      },
    };
  }
}
