import { describe, expect, it } from "vitest";
import { AppError } from "../src/errors/app-error";
import type { EmailReplyAdapter } from "../src/channels/email/email-reply-adapter";
import { EmailReplyService } from "../src/channels/email/email-reply-service";
import { SimulatedEmailReplyAdapter } from "../src/channels/email/simulated-email-reply-adapter";

function validCommand() {
  return {
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    conversationId: "conv_demo_budi_stock",
    customerId: "cust_demo_budi",
    fromEmail: "Agent@Example.test",
    toEmail: "Budi@Example.test",
    subject: "  Follow   up  ",
    textBody: "  Hello Budi,\r\n\r\nWe are helping with your order.  ",
    providerThreadId: " thread_demo_001 ",
    idempotencyKey: " idem_demo_001 ",
  };
}

describe("email reply service", () => {
  it("sends a simulated email reply successfully", async () => {
    const service = new EmailReplyService(new SimulatedEmailReplyAdapter());

    const result = await service.sendReply(validCommand());

    expect(result.status).toBe("simulated");
    expect(result.providerThreadId).toBe("thread_demo_001");
    expect(result.metadata).toEqual({
      provider: "simulated-email",
      transport: "simulated",
    });
  });

  it("fails validation for invalid email address", async () => {
    const service = new EmailReplyService(new SimulatedEmailReplyAdapter());

    await expect(
      service.sendReply({
        ...validCommand(),
        toEmail: "not-an-email",
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      appCode: "VALIDATION_ERROR",
      message: "toEmail must be a valid email address.",
    });
  });

  it("fails validation for empty text body", async () => {
    const service = new EmailReplyService(new SimulatedEmailReplyAdapter());

    await expect(
      service.sendReply({
        ...validCommand(),
        textBody: "   ",
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      appCode: "VALIDATION_ERROR",
      message: "textBody cannot be empty.",
    });
  });

  it("does not leak raw provider payload or reply body on unexpected adapter failure", async () => {
    class FailingAdapter implements EmailReplyAdapter {
      readonly provider = "simulated-email";

      async sendReply(): Promise<never> {
        throw new Error(
          'provider exploded token=secret-demo-token raw_payload={"body":"sensitive"}',
        );
      }
    }

    const service = new EmailReplyService(new FailingAdapter());

    try {
      await service.sendReply(validCommand());
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).appCode).toBe("EMAIL_REPLY_SEND_FAILED");
      expect((error as AppError).message).toBe(
        "Unable to send email reply right now.",
      );
      expect(JSON.stringify(error)).not.toContain("secret-demo-token");
      expect(JSON.stringify(error)).not.toContain("sensitive");
      return;
    }

    throw new Error("Expected service.sendReply to throw.");
  });
});
