import { describe, expect, it } from "vitest";
import { ExtensionSnapshotAiAnalysisService } from "../src/ai/extension-snapshot-ai-analysis-service";
import { FixtureExtensionSnapshotAiAnalysisRepository } from "../src/ai/extension-snapshot-ai-analysis-repository";
import { MockAiAnalysisProvider } from "../src/ai/mock-ai-analysis-provider";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { AuditLogService } from "../src/audit/audit-log-service";
import {
  p17AiConfig,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 final AI audit privacy regression", () => {
  it("writes safe audit metadata only", async () => {
    const auditRepository = new FixtureAuditLogRepository();
    const service = new ExtensionSnapshotAiAnalysisService(
      p17AiConfig(),
      new MockAiAnalysisProvider(),
      new FixtureExtensionSnapshotAiAnalysisRepository(),
      new AuditLogService(auditRepository),
    );

    await service.analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_final_audit",
      snapshot: p17Snapshot(),
      correlationId: "corr_final_audit",
    });

    const audit = JSON.stringify(auditRepository.getState());
    expect(audit).toContain("extension_snapshot_ai_analysis");
    expect(audit).not.toMatch(
      /Need help with order|rawProviderPayload|access_token/,
    );
  });
});
