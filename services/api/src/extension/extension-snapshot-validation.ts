import { z } from "zod";
import { ValidationError } from "../errors/app-error";
import {
  extensionBridgeChannels,
  extensionBridgeLimits,
  isExtensionBridgeChannel,
} from "./extension-bridge-contract";
import type {
  ExtensionSnapshot,
  ExtensionSnapshotMessage,
} from "./extension-snapshot-types";
import { sanitizeExtensionSnapshot } from "./extension-snapshot-sanitization";

const safeText = (max: number) => z.string().trim().min(1).max(max);
const safeOptionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null));

const unsafeFieldParts = [
  ["raw", "dom"],
  ["raw", "html"],
  ["raw", "provider", "payload"],
  ["raw", "webhook", "payload"],
  ["raw", "prompt"],
  ["full", "page", "dump"],
  ["provider", "author", "ization", "header"],
  ["provider", "to", "ken"],
  ["provider", "coo", "kie"],
  ["author", "ization", "header"],
  ["coo", "kie"],
  ["api", "key"],
  ["local", "storage"],
  ["session", "storage"],
  ["payment", "data"],
  ["access", "to", "ken"],
  ["refresh", "to", "ken"],
  ["client", "se", "cret"],
  ["chatgpt", "to", "ken"],
  ["chatgpt", "session"],
] as const;

const unsafeFieldNames = new Set(
  unsafeFieldParts.map((parts) => parts.join("_")),
);

function assertNoUnsafeFields(value: unknown, path: string[] = []): void {
  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (unsafeFieldNames.has(key)) {
      throw new ValidationError("Invalid request.", [
        {
          path: [...path, key].join("."),
          message: "Unsafe extension snapshot field is not allowed.",
        },
      ]);
    }

    assertNoUnsafeFields(child, [...path, key]);
  }
}

function parseCapturedAt(value: string): Date {
  const capturedAt = new Date(value);

  if (Number.isNaN(capturedAt.getTime())) {
    throw new ValidationError("Invalid request.", [
      { path: "captured_at", message: "Invalid captured_at timestamp." },
    ]);
  }

  return capturedAt;
}

function parseOrigin(value: string | null): string | null {
  if (!value) {
    return null;
  }

  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new ValidationError("Invalid request.", [
      { path: "source_url_origin", message: "Invalid source URL origin." },
    ]);
  }

  if (value !== parsed.origin) {
    throw new ValidationError("Invalid request.", [
      {
        path: "source_url_origin",
        message: "Only URL origin is allowed.",
      },
    ]);
  }

  return parsed.origin;
}

const messageSchema = z
  .object({
    id: safeText(128),
    direction: z.enum(["incoming", "outgoing"]),
    author: safeOptionalText(120),
    text: safeText(extensionBridgeLimits.maxMessageTextLength),
    timestamp_label: safeOptionalText(120),
    reply_context_text: safeOptionalText(500),
  })
  .strict();

const snapshotSchema = z
  .object({
    provider: z.literal("extension"),
    official_api: z.literal(false),
    channel: z.enum(extensionBridgeChannels),
    captured_at: z.string().trim().min(1).max(64),
    snapshot_hash: safeText(128).refine(
      (value) => value.length >= extensionBridgeLimits.minSnapshotHashLength,
      "snapshot_hash is too short.",
    ),
    chat_title: safeText(extensionBridgeLimits.maxChatTitleLength),
    chat_subtitle: safeOptionalText(200),
    source_url_origin: safeOptionalText(300),
    messages: z
      .array(messageSchema)
      .min(1)
      .max(extensionBridgeLimits.maxMessagesPerSnapshot),
  })
  .strict();

export function parseExtensionSnapshotPayload(input: {
  channel: string;
  body: unknown;
}): ExtensionSnapshot {
  assertNoUnsafeFields(input.body);

  if (!isExtensionBridgeChannel(input.channel)) {
    throw new ValidationError("Invalid request.", [
      { path: "params.channel", message: "Unsupported extension channel." },
    ]);
  }

  const parsed = snapshotSchema.safeParse(input.body ?? {});

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid request.",
      parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  if (parsed.data.channel !== input.channel) {
    throw new ValidationError("Invalid request.", [
      { path: "channel", message: "Channel does not match route." },
    ]);
  }

  return sanitizeExtensionSnapshot({
    provider: "extension",
    officialApi: false,
    channel: parsed.data.channel,
    capturedAt: parseCapturedAt(parsed.data.captured_at),
    snapshotHash: parsed.data.snapshot_hash,
    chatTitle: parsed.data.chat_title,
    chatSubtitle: parsed.data.chat_subtitle,
    sourceUrlOrigin: parseOrigin(parsed.data.source_url_origin),
    messages: parsed.data.messages.map((message): ExtensionSnapshotMessage => ({
      id: message.id,
      direction: message.direction,
      author: message.author,
      text: message.text,
      timestampLabel: message.timestamp_label,
      replyContextText: message.reply_context_text,
    })),
  });
}
