import { randomUUID } from "node:crypto";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type { ExtensionSnapshotAiAnalysisRecord } from "./extension-snapshot-ai-analysis-types";

export interface ExtensionSnapshotAiAnalysisRepository {
  create(
    input: Omit<ExtensionSnapshotAiAnalysisRecord, "analysisId" | "createdAt">,
  ): Promise<ExtensionSnapshotAiAnalysisRecord>;
  findBySnapshotIdScoped(
    scope: WorkspaceScope,
    snapshotId: string,
  ): Promise<ExtensionSnapshotAiAnalysisRecord | null>;
}

export class FixtureExtensionSnapshotAiAnalysisRepository implements ExtensionSnapshotAiAnalysisRepository {
  private readonly records: ExtensionSnapshotAiAnalysisRecord[] = [];

  async create(
    input: Omit<ExtensionSnapshotAiAnalysisRecord, "analysisId" | "createdAt">,
  ): Promise<ExtensionSnapshotAiAnalysisRecord> {
    const record: ExtensionSnapshotAiAnalysisRecord = {
      ...input,
      analysisId: `ai_analysis_${randomUUID()}`,
      createdAt: new Date().toISOString(),
    };

    this.records.push(record);

    return record;
  }

  async findBySnapshotIdScoped(
    scope: WorkspaceScope,
    snapshotId: string,
  ): Promise<ExtensionSnapshotAiAnalysisRecord | null> {
    return (
      this.records
        .filter(
          (record) =>
            record.organizationId === scope.organizationId &&
            record.workspaceId === scope.workspaceId &&
            record.snapshotId === snapshotId,
        )
        .at(-1) ?? null
    );
  }

  listForTest(): ExtensionSnapshotAiAnalysisRecord[] {
    return [...this.records];
  }
}
