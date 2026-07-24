import { createHash, randomUUID } from "node:crypto";
import type {
  ExtensionSnapshot,
  PersistExtensionSnapshotInput,
  PersistExtensionSnapshotResult,
} from "./extension-snapshot-types";

export interface ExtensionSnapshotRepository {
  persistSnapshot(
    input: PersistExtensionSnapshotInput,
  ): Promise<PersistExtensionSnapshotResult>;
}

export function createExtensionSnapshotId(): string {
  return `extension_snapshot_${randomUUID()}`;
}

export function createExtensionSnapshotMessageId(): string {
  return `extension_snapshot_msg_${randomUUID()}`;
}

export function createExtensionConversationFingerprint(
  snapshot: Pick<ExtensionSnapshot, "channel" | "chatTitle" | "chatSubtitle">,
): string {
  return createHash("sha256")
    .update(
      [
        "extension",
        snapshot.channel,
        snapshot.chatTitle.trim().toLowerCase(),
        snapshot.chatSubtitle?.trim().toLowerCase() ?? "",
      ].join(":"),
    )
    .digest("hex");
}

export function countSnapshotDirections(snapshot: ExtensionSnapshot): {
  incomingCount: number;
  outgoingCount: number;
} {
  return snapshot.messages.reduce(
    (counts, message) => {
      if (message.direction === "incoming") {
        counts.incomingCount += 1;
      } else {
        counts.outgoingCount += 1;
      }

      return counts;
    },
    { incomingCount: 0, outgoingCount: 0 },
  );
}

type StoredSnapshot = PersistExtensionSnapshotResult & {
  organizationId: string;
  workspaceId: string;
  localMessageIds: Set<string>;
};

export class FixtureExtensionSnapshotRepository implements ExtensionSnapshotRepository {
  private readonly snapshots: StoredSnapshot[] = [];

  async persistSnapshot(
    input: PersistExtensionSnapshotInput,
  ): Promise<PersistExtensionSnapshotResult> {
    const fingerprint = createExtensionConversationFingerprint(input.snapshot);
    const existing = this.snapshots.find(
      (snapshot) =>
        snapshot.organizationId === input.scope.organizationId &&
        snapshot.workspaceId === input.scope.workspaceId &&
        snapshot.channel === input.snapshot.channel &&
        snapshot.snapshotHash === input.snapshot.snapshotHash &&
        snapshot.conversationFingerprint === fingerprint,
    );

    if (existing) {
      return {
        ...existing,
        status: "duplicate",
        duplicate: true,
        persistedMessageCount: 0,
      };
    }

    const counts = countSnapshotDirections(input.snapshot);
    const scopedIdSuffix = createHash("sha256")
      .update(
        [input.scope.organizationId, input.scope.workspaceId, fingerprint].join(
          ":",
        ),
      )
      .digest("hex")
      .slice(0, 16);
    const result: StoredSnapshot = {
      organizationId: input.scope.organizationId,
      workspaceId: input.scope.workspaceId,
      snapshotId: createExtensionSnapshotId(),
      status: "accepted",
      duplicate: false,
      channel: input.snapshot.channel,
      snapshotHash: input.snapshot.snapshotHash,
      conversationFingerprint: fingerprint,
      conversationId: `conv_extension_${scopedIdSuffix}`,
      customerId: `cust_extension_${scopedIdSuffix}`,
      messageCount: input.snapshot.messages.length,
      persistedMessageCount: input.snapshot.messages.length,
      incomingCount: counts.incomingCount,
      outgoingCount: counts.outgoingCount,
      capturedAt: input.snapshot.capturedAt,
      localMessageIds: new Set(
        input.snapshot.messages.map((message) => message.id),
      ),
    };

    this.snapshots.push(result);

    return result;
  }

  getSnapshotCount(): number {
    return this.snapshots.length;
  }
}
