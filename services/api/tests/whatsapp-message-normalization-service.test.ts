import { describe, expect, it } from "vitest";
import { WhatsappMessageNormalizationService } from "../src/channels/whatsapp/whatsapp-message-normalization-service";
import { WHATSAPP_MESSAGE_MAX_LENGTH } from "../src/channels/whatsapp/whatsapp-webhook-types";

export function whatsappTextPayload(overrides: Record<string, unknown> = {}) {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            value: {
              metadata: {
                phone_number_id: "wa_phone_demo",
                display_phone_number: "15550000000",
              },
              contacts: [
                {
                  profile: {
                    name: "Ada",
                  },
                },
              ],
              messages: [
                {
                  id: "wamid_demo_1",
                  from: "628000000001",
                  timestamp: "1780000000",
                  type: "text",
                  text: {
                    body: "Need help with my order",
                  },
                  ...overrides,
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

describe("WhatsappMessageNormalizationService", () => {
  it("normalizes supported WhatsApp text message safely", () => {
    const service = new WhatsappMessageNormalizationService();
    const result = service.normalize(whatsappTextPayload());
    const serialized = JSON.stringify(result);

    expect(result.phoneNumberId).toBe("wa_phone_demo");
    expect(result.message).toMatchObject({
      provider: "whatsapp",
      channelType: "messaging",
      externalMessageId: "wamid_demo_1",
      senderExternalId: "628000000001",
      senderDisplayName: "Ada",
      messageText: "Need help with my order",
    });
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("cookie");
    expect(serialized).not.toContain("raw_provider");
  });

  it("rejects unsupported type and oversized text safely", () => {
    const service = new WhatsappMessageNormalizationService();

    expect(() =>
      service.normalize(
        whatsappTextPayload({ type: "image", text: undefined }),
      ),
    ).toThrow("Unsupported WhatsApp message type.");

    expect(() =>
      service.normalize(
        whatsappTextPayload({
          text: {
            body: "x".repeat(WHATSAPP_MESSAGE_MAX_LENGTH + 1),
          },
        }),
      ),
    ).toThrow("WhatsApp message text exceeds the maximum length.");
  });
});
