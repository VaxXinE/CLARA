import { describe, expect, it } from "vitest";
import {
  buildWebhookDedupKey,
  MemoryWebhookReplayGuard,
} from "../src/channels/webhook/webhook-dedup-policy";

describe("P6 webhook dedup and replay policy", () => {
  it("deduplicates provider event ids once per workspace scope", () => {
    const guard = new MemoryWebhookReplayGuard();
    const key = buildWebhookDedupKey({
      organizationId: "org_1",
      workspaceId: "ws_1",
      provider: "whatsapp",
      providerEventId: "evt_1",
    });

    expect(guard.acceptOnce(key)).toMatchObject({
      accepted: true,
      duplicate: false,
    });
    expect(guard.acceptOnce(key)).toMatchObject({
      accepted: false,
      duplicate: true,
      safeReasonCode: "duplicate_replay",
    });
  });

  it("keeps replay keys workspace-scoped", () => {
    const first = buildWebhookDedupKey({
      organizationId: "org_1",
      workspaceId: "ws_1",
      provider: "gmail",
      providerEventId: "evt_1",
    });
    const second = buildWebhookDedupKey({
      organizationId: "org_1",
      workspaceId: "ws_2",
      provider: "gmail",
      providerEventId: "evt_1",
    });

    expect(first).not.toBe(second);
  });

  it("uses a stable normalized content hash fallback without raw payload", () => {
    const first = buildWebhookDedupKey({
      organizationId: "org_1",
      workspaceId: "ws_1",
      provider: "webchat",
      normalizedContent: {
        contact: "customer@example.test",
        message: "hello",
      },
    });
    const second = buildWebhookDedupKey({
      organizationId: "org_1",
      workspaceId: "ws_1",
      provider: "webchat",
      normalizedContent: {
        message: "hello",
        contact: "customer@example.test",
      },
    });

    expect(first).toBe(second);
    expect(first).not.toContain("hello");
    expect(first).not.toContain("customer@example.test");
  });
});
