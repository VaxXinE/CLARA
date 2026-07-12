import { describe, expect, it } from "vitest";
import { FixtureWebchatOutboundDeliveryRepository } from "../src/channels/webchat/webchat-outbound-delivery-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const scope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
};

describe("webchat outbound delivery repository", () => {
  it("persists safe scoped delivery records", async () => {
    const repository = new FixtureWebchatOutboundDeliveryRepository(
      createFixtureAppStore(),
    );

    const record = await repository.recordDelivery({
      scope,
      channelAccountId: "channel_account_demo_webchat",
      conversationId: "conv_demo_sari_followup",
      replyId: "msg_demo_sari_2",
      status: "simulated",
      reasonCode: "simulated_send_completed",
      providerMessageId: "webchat_msg_test",
      sentAt: new Date("2026-07-07T11:00:00.000Z"),
      metadata: {
        source: "webchat_reply_send",
        transport: "simulated",
      },
    });
    const serialized = JSON.stringify(record);

    expect(record).toMatchObject({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      provider: "webchat",
      status: "simulated",
    });
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("cookie");
    expect(serialized).not.toContain("raw_provider");
    expect(serialized).not.toContain("Hello from support");
  });

  it("does not leak cross-workspace delivery records", async () => {
    const repository = new FixtureWebchatOutboundDeliveryRepository(
      createFixtureAppStore(),
    );
    const record = await repository.recordDelivery({
      scope,
      channelAccountId: "channel_account_demo_webchat",
      conversationId: "conv_demo_sari_followup",
      status: "simulated",
      reasonCode: "simulated_send_completed",
      providerMessageId: "webchat_msg_test",
      sentAt: new Date("2026-07-07T11:00:00.000Z"),
      metadata: {
        source: "webchat_reply_send",
      },
    });

    await expect(
      repository.findByIdScoped(
        {
          organizationId: "org_demo_other",
          workspaceId: "wks_demo_other",
        },
        record.id,
      ),
    ).resolves.toBeNull();
  });
});
