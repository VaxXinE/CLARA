import { describe, expect, it } from "vitest";
import { SimulatedEmailReplyAdapter } from "../src/channels/email/simulated-email-reply-adapter";

describe("email reply adapter", () => {
  it("returns a safe simulated send result", async () => {
    const adapter = new SimulatedEmailReplyAdapter();

    const result = await adapter.sendReply({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      fromEmail: "agent@example.test",
      toEmail: "budi@example.test",
      subject: "Order follow-up",
      textBody: "Hi Budi, we are following up on your request.",
      providerThreadId: "thread_demo_001",
    });

    expect(result).toMatchObject({
      status: "simulated",
      providerThreadId: "thread_demo_001",
      metadata: {
        provider: "simulated-email",
        transport: "simulated",
      },
    });
    expect(result.providerMessageId).toMatch(/^email_msg_/);
    expect(result.sentAt).toBeInstanceOf(Date);
    expect(JSON.stringify(result)).not.toContain("Hi Budi");
    expect(JSON.stringify(result)).not.toContain("token");
  });
});
