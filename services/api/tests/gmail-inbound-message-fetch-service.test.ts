import { describe, expect, it, vi } from "vitest";
import type { GmailApiClient } from "../src/channels/email/gmail-api-client";
import type {
  GmailApiAccessTokenProvider,
  GmailApiRequestInput,
} from "../src/channels/email/gmail-api-client-types";
import { GmailApiClientError } from "../src/channels/email/gmail-api-client-types";
import { GmailInboundMessageFetchService } from "../src/channels/email/gmail-inbound-message-fetch-service";
import type {
  GmailListMessagesResponse,
  GmailMessageResponse,
} from "../src/channels/email/gmail-inbound-message-fetch-types";

function createTokenProvider(): GmailApiAccessTokenProvider {
  return {
    getAccessToken: vi.fn(async () => "atk0"),
  };
}

function createGmailApiClient(
  implementation: <T>(input: GmailApiRequestInput) => Promise<T>,
): GmailApiClient {
  return {
    requestJson: vi.fn(implementation) as GmailApiClient["requestJson"],
  };
}

describe("GmailInboundMessageFetchService", () => {
  it("builds the expected list path, clamps maxResults, and never leaks token material", async () => {
    const tokenProvider = createTokenProvider();
    const gmailApiClient = createGmailApiClient(
      async <T>(input: GmailApiRequestInput): Promise<T> => {
        expect(input.accessToken).toBe("atk0");
        expect(input.method).toBe("GET");
        expect(input.path).toBe("/gmail/v1/users/me/messages");
        expect(input.query).toMatchObject({
          maxResults: 100,
          pageToken: "page-token-1",
          q: 'from:sales@example.test subject:"Invoice"',
          labelIds: ["INBOX", "UNREAD"],
        });

        return {
          messages: [
            {
              id: "msg_001",
              threadId: "thr_001",
            },
          ],
          nextPageToken: "page-token-2",
        } satisfies GmailListMessagesResponse as T;
      },
    );
    const service = new GmailInboundMessageFetchService(
      tokenProvider,
      gmailApiClient,
    );

    const result = await service.listMessages({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo",
      maxResults: 999,
      pageToken: "page-token-1",
      query: 'from:sales@example.test subject:"Invoice"',
      labelIds: ["INBOX", "UNREAD"],
    });

    expect(result).toEqual({
      items: [
        {
          provider_message_id: "msg_001",
          thread_id: "thr_001",
          label_ids: [],
        },
      ],
      next_page_token: "page-token-2",
    });
    expect(JSON.stringify(result)).not.toContain("atk0");
  });

  it("rejects unsafe queries and label IDs before any Gmail API call", async () => {
    const tokenProvider = createTokenProvider();
    const gmailApiClient = createGmailApiClient(async <T>(): Promise<T> => {
      throw new Error("should not be called");
    });
    const service = new GmailInboundMessageFetchService(
      tokenProvider,
      gmailApiClient,
    );

    await expect(
      service.listMessages({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        accountId: "gmail_account_demo",
        query: "from:test@example.test {unsafe}",
      }),
    ).rejects.toThrow("Invalid request.");

    await expect(
      service.listMessages({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        accountId: "gmail_account_demo",
        labelIds: ["INBOX", "CUSTOM_LABEL"],
      }),
    ).rejects.toThrow("Invalid request.");
  });

  it("builds the expected get path, allowlists headers, strips attachment body data, and sanitizes provider errors", async () => {
    const tokenProvider = createTokenProvider();
    const gmailApiClient = createGmailApiClient(
      async <T>(input: GmailApiRequestInput): Promise<T> => {
        expect(input.path).toBe("/gmail/v1/users/me/messages/msg_001");
        expect(input.query).toEqual({
          format: "full",
        });

        return {
          id: "msg_001",
          threadId: "thr_001",
          labelIds: ["INBOX", "UNREAD"],
          snippet: "Customer follow up",
          internalDate: "1780000000000",
          payload: {
            partId: "0",
            mimeType: "multipart/alternative",
            headers: [
              {
                name: "From",
                value: "Customer <customer@example.test>",
              },
              {
                name: "Subject",
                value: " Follow up ",
              },
              {
                name: "X-Secret",
                value: "must-drop",
              },
            ],
            body: {
              size: 12,
              data: "must-not-return",
            },
            parts: [
              {
                partId: "1",
                mimeType: "text/plain",
                body: {
                  size: 5,
                  data: "still-nope",
                },
              },
              {
                partId: "2",
                mimeType: "application/pdf",
                filename: "invoice.pdf",
                body: {
                  size: 42,
                  attachmentId: "att_001",
                  data: "binary-nope",
                },
              },
            ],
          },
        } satisfies GmailMessageResponse as T;
      },
    );
    const service = new GmailInboundMessageFetchService(
      tokenProvider,
      gmailApiClient,
    );

    const result = await service.getMessage({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo",
      providerMessageId: "msg_001",
    });

    expect(result).toMatchObject({
      provider_message_id: "msg_001",
      thread_id: "thr_001",
      label_ids: ["INBOX", "UNREAD"],
      snippet: "Customer follow up",
      payload: {
        headers: [
          {
            name: "From",
            value: "Customer <customer@example.test>",
          },
          {
            name: "Subject",
            value: "Follow up",
          },
        ],
        parts: [
          {
            part_id: "1",
            mime_type: "text/plain",
            body_size: 5,
          },
          {
            part_id: "2",
            mime_type: "application/pdf",
            filename: "invoice.pdf",
            body_size: 42,
            attachment_id: "att_001",
          },
        ],
      },
    });
    expect(JSON.stringify(result)).not.toContain("must-not-return");
    expect(JSON.stringify(result)).not.toContain("still-nope");
    expect(JSON.stringify(result)).not.toContain("binary-nope");
    expect(JSON.stringify(result)).not.toContain("atk0");

    const failingService = new GmailInboundMessageFetchService(
      tokenProvider,
      createGmailApiClient(async <T>(): Promise<T> => {
        throw new GmailApiClientError(
          "gmail_api_http_error",
          "raw provider detail",
        );
      }),
    );

    await expect(
      failingService.getMessage({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        accountId: "gmail_account_demo",
        providerMessageId: "msg_001",
      }),
    ).rejects.toThrow("Gmail inbound message fetch failed.");
  });
});
