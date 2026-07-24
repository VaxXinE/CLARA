import type { ExtensionSnapshotAiContextBudget } from "./extension-snapshot-ai-context-types";

export const defaultExtensionSnapshotAiContextBudget = {
  maxMessages: 12,
  maxMessageChars: 1200,
} satisfies ExtensionSnapshotAiContextBudget;

export function resolveExtensionSnapshotAiContextBudget(
  input?: Partial<ExtensionSnapshotAiContextBudget>,
): ExtensionSnapshotAiContextBudget {
  return {
    ...defaultExtensionSnapshotAiContextBudget,
    ...input,
  };
}
