import { createHash } from "node:crypto";

export type WebhookDedupInput = {
  organizationId: string;
  workspaceId: string;
  provider: string;
  providerEventId?: string | null;
  normalizedContent?: unknown;
};

export type WebhookReplayDecision = {
  accepted: boolean;
  duplicate: boolean;
  safeReasonCode: "accepted" | "duplicate_replay";
};

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableJson).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function shortHash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function buildWebhookDedupKey(input: WebhookDedupInput): string {
  const scope = `${input.organizationId}:${input.workspaceId}:${input.provider}`;
  const providerEventId = input.providerEventId?.trim();

  if (providerEventId) {
    return `provider_event:${scope}:${shortHash(providerEventId)}`;
  }

  return `normalized_event:${scope}:${shortHash(
    stableJson(input.normalizedContent ?? {}),
  )}`;
}

export class MemoryWebhookReplayGuard {
  private readonly seenKeys = new Set<string>();

  acceptOnce(key: string): WebhookReplayDecision {
    if (this.seenKeys.has(key)) {
      return {
        accepted: false,
        duplicate: true,
        safeReasonCode: "duplicate_replay",
      };
    }

    this.seenKeys.add(key);

    return {
      accepted: true,
      duplicate: false,
      safeReasonCode: "accepted",
    };
  }
}
