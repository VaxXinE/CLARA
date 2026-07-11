import { describe, expect, it, vi } from "vitest";
import type { GmailOutboundSendClient } from "../src/channels/email/gmail-outbound-send-client-types";
import { GmailOutboundSendService } from "../src/channels/email/gmail-outbound-send-service";
import {
  GMAIL_OUTBOUND_MAX_BODY_LENGTH,
  GMAIL_OUTBOUND_MAX_RECIPIENTS,
  GMAIL_OUTBOUND_MAX_SUBJECT_LENGTH,
  type GmailOutboundSendMessageInput,
} from "../src/channels/email/gmail-outbound-send-service-types";
import { SimulatedGmailOutboundSendClient } from "../src/channels/email/simulated-gmail-outbound-send-client";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const actor = {
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent" as const,
};

function validMessage(): GmailOutboundSendMessageInput {
  return {
    providerAccountId: "gmail_account_demo",
    conversationId: "conv_demo_001",
    to: ["Customer@Example.test"],
    subject: "  Follow   up  ",
    textBody: "  Hello customer,\r\n\r\nWe are checking this.  ",
    idempotencyKey: " idem_001 ",
    correlationId: "corr_001",
  };
}

function expectSafeResult(result: unknown): void {
  const serialized = JSON.stringify(result);

  expect(serialized).not.toContain("atk");
  expect(serialized).not.toContain("rtk");
  expect(serialized).not.toContain("Authorization");
  expect(serialized).not.toContain("raw Gmail payload");
  expect(serialized).not.toContain("raw provider error body");
  expect(serialized).not.toContain(["client", "secret"].join("_"));
}

describe("GmailOutboundSendService", () => {
  it("sends through the simulated Gmail client with a safe result", async () => {
    const store = createFixtureAppStore();
    const initialAiDraftCount = store.aiDraftEvents.length;
    const initialOutboundMessageCount = store.messages.filter(
      (message) => message.direction === "outbound",
    ).length;
    const service = new GmailOutboundSendService(
      new SimulatedGmailOutboundSendClient(),
    );

    const result = await service.send({
      actor,
      message: validMessage(),
    });

    expect(result).toMatchObject({
      status: "simulated",
      provider: "gmail",
      reason_code: "simulated_send_completed",
      correlation_id: "corr_001",
    });
    expect(result.provider_message_id).toMatch(/^gmail_msg_/);
    expect(result.sent_at).toBeDefined();
    expect(store.aiDraftEvents).toHaveLength(initialAiDraftCount);
    expect(
      store.messages.filter((message) => message.direction === "outbound"),
    ).toHaveLength(initialOutboundMessageCount);
    expectSafeResult(result);
  });

  it("rejects invalid recipients and unsafe untrusted scope fields", async () => {
    const service = new GmailOutboundSendService(
      new SimulatedGmailOutboundSendClient(),
    );

    await expect(
      service.send({
        actor,
        message: {
          ...validMessage(),
          to: [],
        },
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "At least one recipient is required.",
    });

    await expect(
      service.send({
        actor,
        message: {
          ...validMessage(),
          organization_id: "org_other",
          workspace_id: "wks_other",
        } as unknown as GmailOutboundSendMessageInput,
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Unsupported Gmail outbound send field.",
    });
  });

  it("rejects empty and oversized message input", async () => {
    const service = new GmailOutboundSendService(
      new SimulatedGmailOutboundSendClient(),
    );

    await expect(
      service.send({
        actor,
        message: {
          ...validMessage(),
          textBody: "   ",
        },
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Gmail outbound body cannot be empty.",
    });

    await expect(
      service.send({
        actor,
        message: {
          ...validMessage(),
          subject: "s".repeat(GMAIL_OUTBOUND_MAX_SUBJECT_LENGTH + 1),
        },
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Gmail outbound subject exceeds the maximum length.",
    });

    await expect(
      service.send({
        actor,
        message: {
          ...validMessage(),
          textBody: "b".repeat(GMAIL_OUTBOUND_MAX_BODY_LENGTH + 1),
        },
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Gmail outbound body exceeds the maximum length.",
    });
  });

  it("rejects too many recipients and viewer callers", async () => {
    const service = new GmailOutboundSendService(
      new SimulatedGmailOutboundSendClient(),
    );

    await expect(
      service.send({
        actor,
        message: {
          ...validMessage(),
          to: Array.from(
            { length: GMAIL_OUTBOUND_MAX_RECIPIENTS + 1 },
            (_, index) => `customer${index}@example.test`,
          ),
        },
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Too many Gmail outbound recipients.",
    });

    await expect(
      service.send({
        actor: {
          ...actor,
          role: "viewer",
        },
        message: validMessage(),
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("maps provider failure to a safe failed result", async () => {
    const client: GmailOutboundSendClient = {
      send: vi.fn(async () => {
        throw new Error(
          "raw Gmail payload Authorization Bearer atk raw provider error body",
        );
      }),
    };
    const service = new GmailOutboundSendService(client);

    const result = await service.send({
      actor,
      message: validMessage(),
    });

    expect(result).toEqual({
      status: "failed",
      provider: "gmail",
      reason_code: "provider_send_failed",
      correlation_id: "corr_001",
    });
    expectSafeResult(result);
  });
});
