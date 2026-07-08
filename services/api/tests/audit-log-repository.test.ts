import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import {
  DrizzleAuditLogRepository,
  FixtureAuditLogRepository,
} from "../src/audit/audit-log-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

function createFakeDatabase(recorder: { values: unknown[] }): Database {
  return {
    insert: vi.fn(() => ({
      values: vi.fn(async (value: unknown) => {
        recorder.values.push(value);
      }),
    })),
  } as unknown as Database;
}

describe("FixtureAuditLogRepository", () => {
  it("stores safe audit rows in fixture state", async () => {
    const store = createFixtureAppStore();
    const repository = new FixtureAuditLogRepository(store);

    await repository.create({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      action: "reply.sent",
      resourceType: "message",
      resourceId: "msg_demo_001",
      outcome: "success",
      metadata: {
        conversation_id: "conv_demo_budi_stock",
        provider: "simulated",
      },
      correlationId: "corr_demo_001",
    });

    const state = repository.getState();

    expect(state.auditLogs).toHaveLength(1);
    expect(state.auditLogs[0]).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      action: "reply.sent",
      resourceType: "message",
      resourceId: "msg_demo_001",
      outcome: "success",
      correlationId: "corr_demo_001",
    });
    expect(state.auditLogs[0]?.metadataJson).toMatchObject({
      conversation_id: "conv_demo_budi_stock",
      provider: "simulated",
    });
  });
});

describe("DrizzleAuditLogRepository", () => {
  it("writes a safe audit row to the database adapter", async () => {
    const recorder = {
      values: [] as unknown[],
    };
    const repository = new DrizzleAuditLogRepository(
      createFakeDatabase(recorder),
    );

    await repository.create({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      action: "ai_draft.generated",
      resourceType: "reply_draft",
      resourceId: "draft_demo_001",
      outcome: "success",
      metadata: {
        conversation_id: "conv_demo_budi_stock",
        provider: "mock",
        latency_ms: 123,
      },
      correlationId: "corr_demo_002",
    });

    expect(recorder.values).toHaveLength(1);
    expect(recorder.values[0]).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      action: "ai_draft.generated",
      resourceType: "reply_draft",
      resourceId: "draft_demo_001",
      outcome: "success",
      correlationId: "corr_demo_002",
    });
    expect(
      (recorder.values[0] as { metadataJson?: unknown }).metadataJson,
    ).toMatchObject({
      conversation_id: "conv_demo_budi_stock",
      provider: "mock",
      latency_ms: 123,
    });
  });
});
