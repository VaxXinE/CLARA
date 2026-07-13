import type { ExtensionConfig } from "../config/extension-config";
import { defaultExtensionConfig } from "../config/extension-config";
import type { ClaraExtensionApiClient } from "../api/clara-extension-api-client";
import type { ActiveConversationSnapshotDraft } from "../types/extension-snapshot";
import { createSnapshotHash } from "./snapshot-hash";
import { normalizeSnapshot } from "./snapshot-normalization";
import type { AutoSyncState, MemoryAutoSyncStorage } from "./auto-sync-storage";

export type ActiveConversationReader = {
  read(): ActiveConversationSnapshotDraft | null;
};

export type AutoSyncStatus = {
  enabled: boolean;
  lastStatus: "idle" | "synced" | "skipped" | "paused" | "error";
  lastSyncAt?: string;
  messageCount: number;
  errorMessage?: string;
};

export class AutoSyncEngine {
  private lastAttemptAt = 0;
  private status: AutoSyncStatus = {
    enabled: true,
    lastStatus: "idle",
    messageCount: 0,
  };

  constructor(
    private readonly input: {
      reader: ActiveConversationReader;
      client: Pick<ClaraExtensionApiClient, "postSnapshot">;
      storage: Pick<MemoryAutoSyncStorage, "read" | "write">;
      config?: Pick<
        ExtensionConfig,
        "minSyncIntervalMs" | "maxMessagesPerSnapshot" | "maxMessageTextLength"
      >;
      now?: () => number;
    },
  ) {}

  getStatus(): AutoSyncStatus {
    return { ...this.status };
  }

  async setEnabled(enabled: boolean): Promise<void> {
    const state = await this.input.storage.read();
    await this.input.storage.write({ ...state, enabled });
    this.status = { ...this.status, enabled };
  }

  async tick(): Promise<AutoSyncStatus> {
    const config = this.input.config ?? defaultExtensionConfig;
    const state = await this.input.storage.read();
    const now = this.input.now?.() ?? Date.now();

    if (!state.enabled) {
      this.status = { ...this.status, enabled: false, lastStatus: "paused" };
      return this.getStatus();
    }

    if (now - this.lastAttemptAt < config.minSyncIntervalMs) {
      this.status = { ...this.status, lastStatus: "skipped" };
      return this.getStatus();
    }

    this.lastAttemptAt = now;

    const draft = this.input.reader.read();

    if (!draft) {
      this.status = {
        enabled: true,
        lastStatus: "skipped",
        messageCount: 0,
        errorMessage: "No supported active conversation.",
      };
      return this.getStatus();
    }

    const snapshotHash = await createSnapshotHash(draft);

    if (snapshotHash === state.lastSnapshotHash) {
      this.status = {
        enabled: true,
        lastStatus: "skipped",
        lastSyncAt: state.lastSyncAt,
        messageCount: draft.messages.length,
      };
      return this.getStatus();
    }

    const snapshot = normalizeSnapshot(draft, snapshotHash, config);
    const result = await this.input.client.postSnapshot(snapshot);

    if (!result.ok) {
      this.status = {
        enabled: true,
        lastStatus: "error",
        lastSyncAt: state.lastSyncAt,
        messageCount: snapshot.messages.length,
        errorMessage: result.reasonCode ?? "Snapshot sync failed.",
      };
      return this.getStatus();
    }

    const lastSyncAt = new Date(now).toISOString();
    const nextState: AutoSyncState = {
      enabled: true,
      lastSnapshotHash: snapshotHash,
      lastSyncAt,
    };

    await this.input.storage.write(nextState);

    this.status = {
      enabled: true,
      lastStatus: "synced",
      lastSyncAt,
      messageCount: snapshot.messages.length,
    };
    return this.getStatus();
  }
}
