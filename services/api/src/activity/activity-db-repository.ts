import { and, desc, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { activityEvents, users } from "../db/schema";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type {
  ActivityEventRecord,
  ActivityRepository,
} from "./activity-repository";

function toActivityEventRecord(row: {
  id: string;
  conversationId: string;
  eventType: string;
  summary: string;
  actorUserId: string | null;
  actorDisplayName: string | null;
  createdAt: Date;
}): ActivityEventRecord {
  return {
    id: row.id,
    conversationId: row.conversationId,
    eventType: row.eventType,
    summary: row.summary,
    actorUserId: row.actorUserId,
    actorDisplayName: row.actorDisplayName,
    createdAt: row.createdAt,
  };
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
      .leftJoin(
        users,
        and(
          eq(activityEvents.actorUserId, users.id),
          eq(users.organizationId, scope.organizationId),
        ),
      )
      .where(
        and(
          eq(activityEvents.organizationId, scope.organizationId),
          eq(activityEvents.workspaceId, scope.workspaceId),
          eq(activityEvents.conversationId, conversationId),
        ),
      )
      .orderBy(desc(activityEvents.createdAt), desc(activityEvents.id));

    return rows.map(toActivityEventRecord);
  }
}
