import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { EmailChannelService } from "../src/channels/email/email-channel-service";
import { SimulatedEmailChannelAdapter } from "../src/channels/email/simulated-email-channel-adapter";

describe("email channel adapter", () => {
  it("defaults email channel mode to disabled", () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      CORS_ORIGIN: "",
    });

    expect(env.EMAIL_CHANNEL_MODE).toBe("disabled");
  });

  it("accepts simulated email channel mode", () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      EMAIL_CHANNEL_MODE: "simulated",
      CORS_ORIGIN: "",
    });

    expect(env.EMAIL_CHANNEL_MODE).toBe("simulated");
  });

  it("uses the simulated adapter to produce a CLARA internal message", async () => {
    const service = new EmailChannelService(new SimulatedEmailChannelAdapter());

    const result = await service.toClaraMessage({
      providerMessageId: "msg_demo_002",
      threadId: "thread_demo_002",
      fromEmail: "sari@example.test",
      fromName: "Sari Demo",
      toEmail: "support@example.test",
      subject: "Question about invoice",
      textBody: "Can you confirm the invoice status?",
      headers: {
        references: "<thread-demo-002@example.test>",
      },
    });

    expect(result).toMatchObject({
      channel: "email",
      provider: "simulated-email",
      externalMessageId: "msg_demo_002",
      externalThreadId: "thread_demo_002",
      customerIdentifier: "sari@example.test",
      customerDisplayName: "Sari Demo",
      destinationIdentifier: "support@example.test",
      subject: "Question about invoice",
      bodyText: "Can you confirm the invoice status?",
      htmlBodyPresent: false,
      attachmentsPresent: false,
      metadata: {
        headers: {
          references: "<thread-demo-002@example.test>",
        },
      },
    });
  });
});
