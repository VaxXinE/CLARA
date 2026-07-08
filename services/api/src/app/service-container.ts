import type { Env } from "../config/env";
import {
  DrizzleActivityRepository,
  FixtureActivityRepository,
} from "../activity/activity-repository";
import { ActivityQueryService } from "../activity/activity-service";
import {
  DrizzleAiDraftRepository,
  FixtureAiDraftRepository,
} from "../ai-drafts/ai-draft-repository";
import { MockAiDraftProvider } from "../ai-drafts/mock-ai-draft-provider";
import { AiDraftService } from "../ai-drafts/ai-draft-service";
import { createDatabase } from "../db/client";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import {
  DrizzleConversationRepository,
  FixtureConversationRepository,
} from "../conversations/conversation-repository";
import { ConversationQueryService } from "../conversations/conversation-service";
import {
  DrizzleCustomerRepository,
  FixtureCustomerRepository,
} from "../customers/customer-repository";
import { CustomerQueryService } from "../customers/customer-service";

export type AppServices = {
  conversations: ConversationQueryService;
  customers: CustomerQueryService;
  activity: ActivityQueryService;
  aiDrafts: AiDraftService;
};

export type AppServiceContainer = {
  services: AppServices;
  close?: () => Promise<void>;
};

export function createAppServiceContainer(env: Env): AppServiceContainer {
  if (env.DATABASE_URL) {
    const { db, pool } = createDatabase(env);
    const conversationRepository = new DrizzleConversationRepository(db);

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
        ),
      },
      close: async () => {
        await pool.end();
      },
    };
  }

  if (env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL is required in production for conversation, customer, activity, and AI draft APIs.",
    );
  }

  const conversationRepository = new FixtureConversationRepository();
  const fixtureStore = createFixtureAppStore();

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
      ),
    },
  };
}
