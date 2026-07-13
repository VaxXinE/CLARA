export type AutoSyncState = {
  enabled: boolean;
  lastSnapshotHash?: string;
  lastSyncAt?: string;
};

export class MemoryAutoSyncStorage {
  private state: AutoSyncState = { enabled: true };

  async read(): Promise<AutoSyncState> {
    return { ...this.state };
  }

  async write(next: AutoSyncState): Promise<void> {
    this.state = { ...next };
  }
}
