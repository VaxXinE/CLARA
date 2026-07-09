import type { WorkspaceScope } from "../../workspace/workspace-scope";

export type EmailIngestionFailure = {
  index: number;
  code: string;
  message: string;
};

export type EmailIngestionBatchResult = {
  attemptedCount: number;
  persistedCount: number;
  duplicateCount: number;
  failedCount: number;
  failures: EmailIngestionFailure[];
};

export type EmailIngestionScope = WorkspaceScope;
