import { describe, expect, it } from "vitest";
import { ValidationError } from "../src/errors/app-error";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import { SimulatedEmailChannelAdapter } from "../src/channels/email/simulated-email-channel-adapter";
import { EmailInboundPersistenceService } from "../src/channels/email/email-inbound-persistence-service";
import {
  FixtureEmailInboundRepository,
  type PersistInboundEmailInput,
  type PersistInboundEmailResult,
} from "../src/channels/email/email-inbound-repository";
import { EmailIngestionService } from "../src/channels/email/email-ingestion-service";
import type { EmailBatchLoadingAdapter } from "../src/channels/email/email-channel-adapter";
import type { SimulatedInboundEmailPayload } from "../src/channels/email/email-channel-types";

const scope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
} as const;

function createHarness(messages: SimulatedInboundEmailPayload[] = []) {
  const store = createFixtureAppStore();
  const repository = new FixtureEmailInboundRepository(store);
  const persistence = new EmailInboundPersistenceService(repository);
  const adapter = new SimulatedEmailChannelAdapter(messages);
  const service = new EmailIngestionService(adapter, persistence);

  return {
    repository,
    service,
  };
}

describe("email ingestion service", () => {
  it("ingests a loaded batch and reports persisted, duplicate, and failed counts", async () => {
    const duplicateMessage = {
      providerMessageId: "email_ingest_dup_001",
      threadId: "email_ingest_thread_dup",
      fromEmail: "dup@example.test",
      fromName: "Duplicate Customer",
      toEmail: "support@example.test",
      subject: "Duplicate email",
      textBody: "Only persist once.",
      receivedAt: "2026-07-09T13:00:00.000Z",
    };

    const { service } = createHarness([
      {
        providerMessageId: "email_ingest_ok_001",
        threadId: "email_ingest_thread_001",
        fromEmail: "ok@example.test",
        fromName: "OK Customer",
        toEmail: "support@example.test",
        subject: "Need assistance",
        textBody: "Please help with onboarding.",
        receivedAt: "2026-07-09T12:00:00.000Z",
      },
      duplicateMessage,
      duplicateMessage,
      {
        providerMessageId: "email_ingest_fail_001",
        threadId: "email_ingest_thread_fail",
        fromEmail: "invalid-email",
        toEmail: "support@example.test",
        subject: "Invalid sender",
        textBody: "This should fail safely.",
        receivedAt: "2026-07-09T14:00:00.000Z",
      },
    ]);

    const result = await service.ingestAvailableMessages({ scope });

    expect(result).toEqual({
      attemptedCount: 4,
      persistedCount: 2,
      duplicateCount: 1,
      failedCount: 1,
      failures: [
        {
          index: 3,
          code: "VALIDATION_ERROR",
          message: "fromEmail must be a valid email address.",
        },
      ],
    });
  });

  it("can ingest an explicit message array without relying on adapter loading", async () => {
    const { service, repository } = createHarness();

    const result = await service.ingestMessages({
      scope,
      messages: [
        {
          providerMessageId: "email_ingest_manual_001",
          threadId: "email_ingest_manual_thread",
          fromEmail: "manual@example.test",
          fromName: "Manual Customer",
          toEmail: "support@example.test",
          subject: "Manual ingest",
          textBody: "Persist through explicit list.",
          receivedAt: "2026-07-09T15:00:00.000Z",
        },
      ],
    });

    expect(result.persistedCount).toBe(1);
    expect(result.duplicateCount).toBe(0);
    expect(result.failedCount).toBe(0);
    expect(
      repository
        .getState()
        .messages.some(
          (message) => message.body === "Persist through explicit list.",
        ),
    ).toBe(true);
  });

  it("keeps processing later items after one item fails validation", async () => {
    const { service, repository } = createHarness();

    const result = await service.ingestMessages({
      scope,
      messages: [
        {
          providerMessageId: "email_ingest_fail_mid_001",
          threadId: "thread_fail_mid",
          fromEmail: "bad-email",
          toEmail: "support@example.test",
          subject: "Broken",
          textBody: "Broken item",
          receivedAt: "2026-07-09T16:00:00.000Z",
        },
        {
          providerMessageId: "email_ingest_ok_after_fail_001",
          threadId: "thread_ok_after_fail",
          fromEmail: "after-fail@example.test",
          fromName: "After Fail",
          toEmail: "support@example.test",
          subject: "Still process me",
          textBody: "Second item should succeed.",
          receivedAt: "2026-07-09T16:05:00.000Z",
        },
      ],
    });

    expect(result.persistedCount).toBe(1);
    expect(result.failedCount).toBe(1);
    expect(result.failures[0]).toMatchObject({
      index: 0,
      code: "VALIDATION_ERROR",
    });
    expect(
      repository
        .getState()
        .customers.some(
          (customer) =>
            customer.contactIdentifier === "after-fail@example.test",
        ),
    ).toBe(true);
  });

  it("returns a generic safe failure for unexpected persistence errors", async () => {
    class ThrowingRepository extends FixtureEmailInboundRepository {
      override async persistInboundEmail(
        _input: PersistInboundEmailInput,
      ): Promise<PersistInboundEmailResult> {
        throw new Error("boom raw-body=secret message");
      }
    }

    const store = createFixtureAppStore();
    const persistence = new EmailInboundPersistenceService(
      new ThrowingRepository(store),
    );
    const adapter = new SimulatedEmailChannelAdapter();
    const service = new EmailIngestionService(adapter, persistence);

    const result = await service.ingestMessages({
      scope,
      messages: [
        {
          providerMessageId: "email_ingest_unexpected_001",
          threadId: "thread_unexpected",
          fromEmail: "unexpected@example.test",
          toEmail: "support@example.test",
          subject: "Unexpected error",
          textBody: "Unexpected failure item.",
          receivedAt: "2026-07-09T17:00:00.000Z",
        },
      ],
    });

    expect(result).toEqual({
      attemptedCount: 1,
      persistedCount: 0,
      duplicateCount: 0,
      failedCount: 1,
      failures: [
        {
          index: 0,
          code: "EMAIL_INGESTION_FAILED",
          message: "Email ingestion failed for this item.",
        },
      ],
    });
  });

  it("fails the whole run when the adapter batch loader itself fails", async () => {
    class FailingLoaderAdapter implements EmailBatchLoadingAdapter<SimulatedInboundEmailPayload> {
      readonly provider = "simulated-email";

      async loadInboundMessages(): Promise<SimulatedInboundEmailPayload[]> {
        throw new ValidationError("Inbound email batch is unavailable.");
      }

      async normalizeInboundMessage(): Promise<never> {
        throw new Error("normalize should not be called");
      }
    }

    const store = createFixtureAppStore();
    const persistence = new EmailInboundPersistenceService(
      new FixtureEmailInboundRepository(store),
    );
    const service = new EmailIngestionService(
      new FailingLoaderAdapter(),
      persistence,
    );

    await expect(service.ingestAvailableMessages({ scope })).rejects.toThrow(
      "Inbound email batch is unavailable.",
    );
  });
});
