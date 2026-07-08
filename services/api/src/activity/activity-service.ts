import { assertPermission } from "../auth/permissions";
import type { AuthContext } from "../auth/auth-context";
import { NotFoundError } from "../errors/app-error";
import type { ConversationRepository } from "../conversations/conversation-repository";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import {
  toActivityItemDto,
  type ConversationActivityDto,
} from "./activity-dto";
import type { ActivityRepository } from "./activity-repository";

export type ConversationActivityResult = {
  data: ConversationActivityDto;
};

export class ActivityQueryService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly conversationRepository: Pick<
      ConversationRepository,
      "findByIdScoped"
    >,
  ) {}

  async getConversationActivity(input: {
    auth: AuthContext;
    conversationId: string;
  }): Promise<ConversationActivityResult> {
    assertPermission(input.auth.role, "activity:read");

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const conversation = await this.conversationRepository.findByIdScoped(
      scope,
      input.conversationId,
    );

    if (!conversation) {
      throw new NotFoundError("Conversation not found.");
    }

    const items = await this.activityRepository.listByConversationScoped(
      scope,
      input.conversationId,
    );

    return {
      data: {
        conversation_id: input.conversationId,
        items: items.map(toActivityItemDto),
      },
    };
  }
}
