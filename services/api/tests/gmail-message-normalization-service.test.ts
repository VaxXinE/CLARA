import { describe, expect, it } from "vitest";
import type { GmailInboundMessageDto } from "../src/channels/email/gmail-inbound-message-fetch-types";
import { GmailMessageNormalizationService } from "../src/channels/email/gmail-message-normalization-service";

describe("GmailMessageNormalizationService", () => {
  it("normalizes a fetched Gmail message into a safe inbound email envelope", () => {
    const service = new GmailMessageNormalizationService();

    const result = service.normalizeMessage({
      account: {
        id: "gmail_account_demo",
        emailAddress: "support@example.test",
      },
      message: {
        provider_message_id: "msg_001",
        thread_id: "thr_001",
        label_ids: ["INBOX", "UNREAD"],
        snippet: "  Halo tim, saya butuh bantuan.  ",
        internal_date: "1783677600000",
        payload: {
          mime_type: "multipart/alternative",
          headers: [
            {
              name: "From",
              value: '"Budi Customer" <budi@example.test>',
            },
            {
              name: "To",
              value: "support@example.test",
            },
            {
              name: "Cc",
              value: "agent1@example.test, Agent Two <agent2@example.test>",
            },
            {
              name: "Bcc",
              value: "manager@example.test",
            },
            {
              name: "Subject",
              value: "  Need   help  ",
            },
            {
              name: "Date",
              value: "Fri, 10 Jul 2026 10:00:00 +0000",
            },
            {
              name: "Message-ID",
              value: "<msg_001@example.test>",
            },
            {
              name: "In-Reply-To",
              value: "<prev@example.test>",
            },
            {
              name: "References",
              value: "<root@example.test> <prev@example.test>",
            },
          ],
          parts: [
            {
              mime_type: "text/plain",
              headers: [],
              body_size: 42,
            },
            {
              mime_type: "text/html",
              headers: [],
              body_size: 99,
            },
            {
              filename: "invoice.pdf",
              attachment_id: "att_001",
              headers: [],
              body_size: 100,
            },
          ],
        },
      } as GmailInboundMessageDto,
      now: new Date("2026-07-10T12:00:00.000Z"),
    });

    expect(result).toMatchObject({
      provider: "gmail",
      provider_account_id: "gmail_account_demo",
      provider_message_id: "msg_001",
      provider_thread_id: "thr_001",
      message_id: "<msg_001@example.test>",
      in_reply_to: "<prev@example.test>",
      references: "<root@example.test> <prev@example.test>",
      snippet: "Halo tim, saya butuh bantuan.",
      label_ids: ["INBOX", "UNREAD"],
      cc: ["agent1@example.test", "agent2@example.test"],
      bcc: ["manager@example.test"],
      email: {
        provider: "gmail",
        providerMessageId: "msg_001",
        threadId: "thr_001",
        fromEmail: "budi@example.test",
        fromName: "Budi Customer",
        toEmail: "support@example.test",
        subject: "Need help",
        textBody: "Halo tim, saya butuh bantuan.",
        htmlBodyPresent: true,
        attachmentsPresent: true,
        headers: {
          "message-id": "<msg_001@example.test>",
          "in-reply-to": "<prev@example.test>",
          references: "<root@example.test> <prev@example.test>",
        },
      },
    });
    expect(result.email.receivedAt.toISOString()).toBe(
      "2026-07-10T10:00:00.000Z",
    );
    expect(JSON.stringify(result)).not.toContain("should-not-survive");
  });

  it("falls back to the connected mailbox when To is not present and ignores unknown headers", () => {
    const service = new GmailMessageNormalizationService();

    const result = service.normalizeMessage({
      account: {
        id: "gmail_account_demo",
        emailAddress: "support@example.test",
      },
      message: {
        provider_message_id: "msg_002",
        label_ids: [],
        payload: {
          headers: [
            {
              name: "From",
              value: "customer@example.test",
            },
            {
              name: "x-trace-id",
              value: "do-not-keep",
            },
          ],
        },
      } as unknown as GmailInboundMessageDto,
    });

    expect(result.email.toEmail).toBe("support@example.test");
    expect(result.email.headers).toEqual({});
    expect(JSON.stringify(result)).not.toContain("do-not-keep");
  });
});
