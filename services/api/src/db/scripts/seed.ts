import { createDatabase } from "../client";
import { loadEnv } from "../../config/env";
import { demoSeedData } from "../fixtures/demo-data";
import {
  activityEvents,
  auditLogs,
  aiDraftEvents,
  channelAccounts,
  conversations,
  customerNotes,
  customers,
  emailInboundRecords,
  emailOutboundDeliveries,
  messages,
  organizations,
  replyDrafts,
  users,
  webchatInboundMessages,
  webchatOutboundDeliveries,
  whatsappInboundMessages,
  whatsappOutboundDeliveries,
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
        .insert(customerNotes)
        .values(demoSeedData.customerNotes)
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
      if (demoSeedData.auditLogs.length > 0) {
        await tx
          .insert(auditLogs)
          .values(demoSeedData.auditLogs)
          .onConflictDoNothing();
      }
      await tx
        .insert(channelAccounts)
        .values(demoSeedData.channelAccounts)
        .onConflictDoNothing();
      if (demoSeedData.emailInboundRecords.length > 0) {
        await tx
          .insert(emailInboundRecords)
          .values(demoSeedData.emailInboundRecords)
          .onConflictDoNothing();
      }
      if (demoSeedData.emailOutboundDeliveries.length > 0) {
        await tx
          .insert(emailOutboundDeliveries)
          .values(demoSeedData.emailOutboundDeliveries)
          .onConflictDoNothing();
      }
      if (demoSeedData.webchatInboundMessages.length > 0) {
        await tx
          .insert(webchatInboundMessages)
          .values(demoSeedData.webchatInboundMessages)
          .onConflictDoNothing();
      }
      if (demoSeedData.webchatOutboundDeliveries.length > 0) {
        await tx
          .insert(webchatOutboundDeliveries)
          .values(demoSeedData.webchatOutboundDeliveries)
          .onConflictDoNothing();
      }
      if (demoSeedData.whatsappInboundMessages.length > 0) {
        await tx
          .insert(whatsappInboundMessages)
          .values(demoSeedData.whatsappInboundMessages)
          .onConflictDoNothing();
      }
      if (demoSeedData.whatsappOutboundDeliveries.length > 0) {
        await tx
          .insert(whatsappOutboundDeliveries)
          .values(demoSeedData.whatsappOutboundDeliveries)
          .onConflictDoNothing();
      }
    });
  } finally {
    await pool.end();
  }
}

await run();
