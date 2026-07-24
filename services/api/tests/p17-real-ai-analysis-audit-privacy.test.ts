import { describe, expect, it } from "vitest";
import { AuditLogService } from "../src/audit/audit-log-service";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { ExtensionSnapshotAiAnalysisService } from "../src/ai/extension-snapshot-ai-analysis-service";
import { FixtureExtensionSnapshotAiAnalysisRepository } from "../src/ai/extension-snapshot-ai-analysis-repository";
import { MockAiAnalysisProvider } from "../src/ai/mock-ai-analysis-provider";
import {
  p17AiConfig,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 real AI analysis audit privacy", () => {
  it("records only safe audit metadata", async () => {
    const auditRepository = new FixtureAuditLogRepository();
    const auditLogs = new AuditLogService(auditRepository);
    const service = new ExtensionSnapshotAiAnalysisService(
      p17AiConfig(),
      new MockAiAnalysisProvider(),
      new FixtureExtensionSnapshotAiAnalysisRepository(),
      auditLogs,
    );

    await service.analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_audit",
      snapshot: p17Snapshot(),
      correlationId: "corr_audit",
    });

    const auditState = JSON.stringify(auditRepository.getState());
    expect(auditState).toContain("extension_snapshot_ai_analysis_requested");
    expect(auditState).toContain("extension_snapshot_ai_analysis_generated");
    expect(auditState).not.toContain("Need help with order.");
    expect(auditState).not.toContain("rawProviderPayload");
    expect(auditState).not.toContain("access_token");
  });
});
