import type { Env } from "../config/env";
import { FixtureActivityRepository } from "../activity/activity-repository";
import { DrizzleActivityRepository } from "../activity/activity-db-repository";
import { ActivityQueryService } from "../activity/activity-service";
import {
  DrizzleAuditLogRepository,
  FixtureAuditLogRepository,
} from "../audit/audit-log-repository";
import { AuditLogService } from "../audit/audit-log-service";
import { FixtureAiDraftRepository } from "../ai-drafts/ai-draft-repository";
import { DrizzleAiDraftRepository } from "../ai-drafts/ai-draft-db-repository";
import { MockAiDraftProvider } from "../ai-drafts/mock-ai-draft-provider";
import { AiDraftService } from "../ai-drafts/ai-draft-service";
import {
  DrizzleWorkspaceMembershipRepository,
  FixtureWorkspaceMembershipRepository,
} from "../auth/workspace-membership-repository";
import { WorkspaceMembershipService } from "../auth/workspace-membership-service";
import { createDatabase } from "../db/client";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import { FixtureConversationRepository } from "../conversations/conversation-repository";
import { DrizzleConversationRepository } from "../conversations/conversation-db-repository";
import { ConversationQueryService } from "../conversations/conversation-service";
import { FixtureCustomerRepository } from "../customers/customer-repository";
import { DrizzleCustomerRepository } from "../customers/customer-db-repository";
import { CustomerQueryService } from "../customers/customer-service";
import { FixtureReplyRepository } from "../replies/reply-repository";
import { DrizzleReplyRepository } from "../replies/reply-db-repository";
import { ReplyService } from "../replies/reply-service";
import { SimulatedReplySendProvider } from "../replies/simulated-reply-send-provider";

export type AppServices = {
  conversations: ConversationQueryService;
  customers: CustomerQueryService;
  activity: ActivityQueryService;
  aiDrafts: AiDraftService;
  replies: ReplyService;
};

export type AuthServices = {
  workspaceMemberships: WorkspaceMembershipService;
};

export type AppServiceContainer = {
  services: AppServices;
  auth: AuthServices;
  close?: () => Promise<void>;
};

function shouldUseDatabaseRepositories(env: Env): boolean {
  return Boolean(env.DATABASE_URL);
}

export function createAppServiceContainer(env: Env): AppServiceContainer {
  if (shouldUseDatabaseRepositories(env)) {
    const { db, pool } = createDatabase(env);
    const conversationRepository = new DrizzleConversationRepository(db);
    const auditLogs = new AuditLogService(new DrizzleAuditLogRepository(db));

    return {
      services: {
        conversations: new ConversationQueryService(conversationRepository),
        customers: new CustomerQueryService(new DrizzleCustomerRepository(db)),
        activity: new ActivityQueryService(
          new DrizzleActivityRepository(db),
          conversationRepository,
        ),
        aiDrafts: new AiDraftService(
          conversationRepository,
          new DrizzleAiDraftRepository(db),
          new MockAiDraftProvider(),
          auditLogs,
        ),
        replies: new ReplyService(
          conversationRepository,
          new DrizzleReplyRepository(db),
          new SimulatedReplySendProvider(),
          auditLogs,
        ),
      },
      auth: {
        workspaceMemberships: new WorkspaceMembershipService(
          new DrizzleWorkspaceMembershipRepository(db),
        ),
      },
      close: async () => {
        await pool.end();
      },
    };
  }

  if (env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL is required in production so conversation, customer, activity, and related APIs do not fall back to fixture data.",
    );
  }

  const fixtureStore = createFixtureAppStore();
  const conversationRepository = new FixtureConversationRepository(
    fixtureStore,
  );
  const auditLogs = new AuditLogService(
    new FixtureAuditLogRepository(fixtureStore),
  );

  return {
    services: {
      conversations: new ConversationQueryService(conversationRepository),
      customers: new CustomerQueryService(new FixtureCustomerRepository()),
      activity: new ActivityQueryService(
        new FixtureActivityRepository(fixtureStore),
        conversationRepository,
      ),
      aiDrafts: new AiDraftService(
        conversationRepository,
        new FixtureAiDraftRepository(fixtureStore),
        new MockAiDraftProvider(),
        auditLogs,
      ),
      replies: new ReplyService(
        conversationRepository,
        new FixtureReplyRepository(fixtureStore),
        new SimulatedReplySendProvider(),
        auditLogs,
      ),
    },
    auth: {
      workspaceMemberships: new WorkspaceMembershipService(
        new FixtureWorkspaceMembershipRepository(),
      ),
    },
  };
}
