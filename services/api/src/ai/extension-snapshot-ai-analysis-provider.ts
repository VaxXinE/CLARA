import type {
  ExtensionSnapshotAiAnalysisProviderInput,
  ExtensionSnapshotAiAnalysisProviderResult,
} from "./extension-snapshot-ai-analysis-types";

export interface ExtensionSnapshotAiAnalysisProvider {
  analyze(
    input: ExtensionSnapshotAiAnalysisProviderInput,
  ): Promise<ExtensionSnapshotAiAnalysisProviderResult>;
}
