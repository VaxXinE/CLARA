import { createDatabase } from "../client";
import { loadEnv } from "../../config/env";
import { demoSeedData } from "../fixtures/demo-data";
import {
  activityEvents,
  aiDraftEvents,
  conversations,
  customers,
  messages,
  organizations,
  replyDrafts,
  users,
  workspaceMemberships,
  workspaces,
} from "../schema";

async function run(): Promise<void> {
  const env = loadEnv();
  const { db, pool } = createDatabase(env);

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(organizations)
        .values(demoSeedData.organizations)
        .onConflictDoNothing();
      await tx
        .insert(workspaces)
        .values(demoSeedData.workspaces)
        .onConflictDoNothing();
      await tx.insert(users).values(demoSeedData.users).onConflictDoNothing();
      await tx
        .insert(workspaceMemberships)
        .values(demoSeedData.workspaceMemberships)
        .onConflictDoNothing();
      await tx
        .insert(customers)
        .values(demoSeedData.customers)
        .onConflictDoNothing();
      await tx
        .insert(conversations)
        .values(demoSeedData.conversations)
        .onConflictDoNothing();
      await tx
        .insert(messages)
        .values(demoSeedData.messages)
        .onConflictDoNothing();
      await tx
        .insert(replyDrafts)
        .values(demoSeedData.replyDrafts)
        .onConflictDoNothing();
      await tx
        .insert(aiDraftEvents)
        .values(demoSeedData.aiDraftEvents)
        .onConflictDoNothing();
      await tx
        .insert(activityEvents)
        .values(demoSeedData.activityEvents)
        .onConflictDoNothing();
    });
  } finally {
    await pool.end();
  }
}

await run();
