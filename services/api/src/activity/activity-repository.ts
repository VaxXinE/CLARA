import { demoUsers } from "../db/fixtures/demo-data";
import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
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
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async listByConversationScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<ActivityEventRecord[]> {
    const usersById = new Map(
      demoUsers.map((user) => [user.id, user.displayName]),
    );

    return [...this.store.activityEvents]
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
