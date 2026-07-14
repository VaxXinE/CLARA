import { createHash } from "node:crypto";

export type OutboundIdempotencyInput = {
  organizationId: string;
  workspaceId: string;
  channel: string;
  channelAccountId: string;
  idempotencyKey: string;
};

export type OutboundIdempotencyReservation = {
  reserved: boolean;
  duplicate: boolean;
  scopedKey: string;
};

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function buildOutboundIdempotencyKey(
  input: OutboundIdempotencyInput,
): string {
  return [
    "outbound",
    input.organizationId,
    input.workspaceId,
    input.channel,
    input.channelAccountId,
    hash(input.idempotencyKey.trim()),
  ].join(":");
}

export class MemoryOutboundIdempotencyStore {
  private readonly reservedKeys = new Set<string>();

  reserve(input: OutboundIdempotencyInput): OutboundIdempotencyReservation {
    const scopedKey = buildOutboundIdempotencyKey(input);

    if (this.reservedKeys.has(scopedKey)) {
      return {
        reserved: false,
        duplicate: true,
        scopedKey,
      };
    }

    this.reservedKeys.add(scopedKey);

    return {
      reserved: true,
      duplicate: false,
      scopedKey,
    };
  }
}
