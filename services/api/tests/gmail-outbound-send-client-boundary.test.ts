import { describe, expect, it } from "vitest";
import { SimulatedGmailOutboundSendClient } from "../src/channels/email/simulated-gmail-outbound-send-client";

describe("Gmail outbound send client boundary", () => {
  it("returns a safe simulated result without token or raw provider payload fields", async () => {
    const client = new SimulatedGmailOutboundSendClient();

    const result = await client.send({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      to: ["customer@example.test"],
      cc: [],
      bcc: [],
      subject: "Follow up",
      textBody: "Safe reply body",
      conversationId: "conv_demo_001",
      idempotencyKey: "idem_001",
      correlationId: "corr_001",
    });
    const serialized = JSON.stringify(result);

    expect(result.status).toBe("simulated");
    expect(result.providerMessageId).toMatch(/^gmail_msg_/);
    expect(result.sentAt).toBeInstanceOf(Date);
    expect(serialized).not.toContain("atk");
    expect(serialized).not.toContain("rtk");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw Gmail payload");
    expect(serialized).not.toContain("raw provider error body");
    expect(serialized).not.toContain(["client", "secret"].join("_"));
  });
});
