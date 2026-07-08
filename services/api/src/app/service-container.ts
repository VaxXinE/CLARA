import type { Env } from "../config/env";
import { createDatabase } from "../db/client";
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
};

export type AppServiceContainer = {
  services: AppServices;
  close?: () => Promise<void>;
};

export function createAppServiceContainer(env: Env): AppServiceContainer {
  if (env.DATABASE_URL) {
    const { db, pool } = createDatabase(env);

    return {
      services: {
        conversations: new ConversationQueryService(
          new DrizzleConversationRepository(db),
        ),
        customers: new CustomerQueryService(new DrizzleCustomerRepository(db)),
      },
      close: async () => {
        await pool.end();
      },
    };
  }

  if (env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL is required in production for conversation and customer APIs.",
    );
  }

  return {
    services: {
      conversations: new ConversationQueryService(
        new FixtureConversationRepository(),
      ),
      customers: new CustomerQueryService(new FixtureCustomerRepository()),
    },
  };
}
