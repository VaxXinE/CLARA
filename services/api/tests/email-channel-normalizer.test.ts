import { describe, expect, it } from "vitest";
import { ValidationError } from "../src/errors/app-error";
import {
  normalizeInboundEmailPayload,
  toClaraInboundChannelMessage,
} from "../src/channels/email/email-normalizer";

describe("email inbound normalizer", () => {
  it("normalizes inbound email payload into a safe CLARA-friendly shape", () => {
    const normalized = normalizeInboundEmailPayload({
      providerMessageId: "  msg_demo_001  ",
      threadId: "  thread_demo_001  ",
      fromEmail: "  Customer@Example.TEST  ",
      fromName: "  Budi   Santoso  ",
      toEmail: " support@example.test ",
      subject: "  Need   help with order  ",
      textBody: "Hello team,\r\n\r\nPlease help.\r\n",
      htmlBody:
        "<div>Hello</div><script>alert('xss')</script><p>Please help.</p>",
      receivedAt: "2026-07-09T04:00:00.000Z",
      headers: {
        "message-id": "  <msg_demo_001@example.test>  ",
        "reply-to": "  reply@example.test  ",
        authorization: "Bearer should-not-be-kept",
      },
      attachments: [
        {
          filename: "invoice.pdf",
        },
      ],
    });

    expect(normalized).toMatchObject({
      provider: "simulated-email",
      providerMessageId: "msg_demo_001",
      threadId: "thread_demo_001",
      fromEmail: "customer@example.test",
      fromName: "Budi Santoso",
      toEmail: "support@example.test",
      subject: "Need help with order",
      textBody: "Hello team,\n\nPlease help.",
      htmlBodyPresent: true,
      attachmentsPresent: true,
      headers: {
        "message-id": "<msg_demo_001@example.test>",
        "reply-to": "reply@example.test",
      },
    });
    expect(normalized.receivedAt.toISOString()).toBe(
      "2026-07-09T04:00:00.000Z",
    );
    expect(normalized.headers).not.toHaveProperty("authorization");

    const claraMessage = toClaraInboundChannelMessage(normalized);

    expect(claraMessage).toMatchObject({
      channel: "email",
      provider: "simulated-email",
      externalMessageId: "msg_demo_001",
      externalThreadId: "thread_demo_001",
      customerIdentifier: "customer@example.test",
      customerDisplayName: "Budi Santoso",
      destinationIdentifier: "support@example.test",
      subject: "Need help with order",
      bodyText: "Hello team,\n\nPlease help.",
      htmlBodyPresent: true,
      attachmentsPresent: true,
      metadata: {
        headers: {
          "message-id": "<msg_demo_001@example.test>",
          "reply-to": "reply@example.test",
        },
      },
    });
  });

  it("keeps HTML presence as a boolean and does not expose raw html", () => {
    const normalized = normalizeInboundEmailPayload({
      providerMessageId: "msg_demo_html_only",
      fromEmail: "customer@example.test",
      toEmail: "support@example.test",
      htmlBody: "<script>alert('xss')</script><p>Hello</p>",
    });

    expect(normalized.textBody).toBe("");
    expect(normalized.htmlBodyPresent).toBe(true);
    expect(JSON.stringify(normalized)).not.toContain("<script>");
  });

  it("rejects invalid email addresses", () => {
    expect(() =>
      normalizeInboundEmailPayload({
        providerMessageId: "msg_demo_invalid",
        fromEmail: "not-an-email",
        toEmail: "support@example.test",
      }),
    ).toThrowError(ValidationError);
  });

  it("requires providerMessageId", () => {
    expect(() =>
      normalizeInboundEmailPayload({
        fromEmail: "customer@example.test",
        toEmail: "support@example.test",
      }),
    ).toThrow("providerMessageId is required.");
  });
});
