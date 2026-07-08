import { and, desc, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { demoActivityEvents, demoUsers } from "../db/fixtures/demo-data";
import { activityEvents, users } from "../db/schema";
import type { WorkspaceScope } from "../workspace/workspace-scope";

export type ActivityEventRecord = {
  id: string;
  conversationId: string;
  eventType: string;
  summary: string;
  actorUserId: string | null;
  actorDisplayName: string | null;
  createdAt: Date;
};

export interface ActivityRepository {
  listByConversationScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<ActivityEventRecord[]>;
}

function requireDate(value: Date | undefined, field: string): Date {
  if (!value) {
    throw new Error(`Fixture is missing required date field: ${field}`);
  }

  return value;
}

export class FixtureActivityRepository implements ActivityRepository {
  async listByConversationScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<ActivityEventRecord[]> {
    const usersById = new Map(
      demoUsers.map((user) => [user.id, user.displayName]),
    );

    return [...demoActivityEvents]
      .filter(
        (event) =>
          event.organizationId === scope.organizationId &&
          event.workspaceId === scope.workspaceId &&
          event.conversationId === conversationId,
      )
      .sort((left, right) => {
        const createdDelta =
          requireDate(right.createdAt, "activity.createdAt").getTime() -
          requireDate(left.createdAt, "activity.createdAt").getTime();

        if (createdDelta !== 0) {
          return createdDelta;
        }

        return right.id.localeCompare(left.id);
      })
      .map((event) => ({
        id: event.id,
        conversationId: event.conversationId,
        eventType: event.eventType,
        summary: event.summary,
        actorUserId: event.actorUserId ?? null,
        actorDisplayName: event.actorUserId
          ? (usersById.get(event.actorUserId) ?? null)
          : null,
        createdAt: requireDate(event.createdAt, "activity.createdAt"),
      }));
  }
}

export class DrizzleActivityRepository implements ActivityRepository {
  constructor(private readonly db: Database) {}

  async listByConversationScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<ActivityEventRecord[]> {
    const rows = await this.db
      .select({
        id: activityEvents.id,
        conversationId: activityEvents.conversationId,
        eventType: activityEvents.eventType,
        summary: activityEvents.summary,
        actorUserId: activityEvents.actorUserId,
        actorDisplayName: users.displayName,
        createdAt: activityEvents.createdAt,
      })
      .from(activityEvents)
      .leftJoin(users, eq(activityEvents.actorUserId, users.id))
      .where(
        and(
          eq(activityEvents.organizationId, scope.organizationId),
          eq(activityEvents.workspaceId, scope.workspaceId),
          eq(activityEvents.conversationId, conversationId),
        ),
      )
      .orderBy(desc(activityEvents.createdAt), desc(activityEvents.id));

    return rows.map((row) => ({
      id: row.id,
      conversationId: row.conversationId,
      eventType: row.eventType,
      summary: row.summary,
      actorUserId: row.actorUserId,
      actorDisplayName: row.actorDisplayName,
      createdAt: row.createdAt,
    }));
  }
}
