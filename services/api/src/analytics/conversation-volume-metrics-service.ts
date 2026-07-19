import type { AuthContext } from "../auth/auth-context";
import type { ConversationQueryService } from "../conversations/conversation-service";
import { getAnalyticsWorkspaceScope } from "./analytics-read-model-policy";
import { assertSafeCoreOperationalMetricsQuery } from "./core-operational-metrics-policy";
import {
  buildCoreOperationalMetric,
  buildCoreOperationalMetricsResponse,
} from "./conversation-volume-metrics-dto";
import type {
  CoreOperationalCategory,
  CoreOperationalMetricsQuery,
  CoreOperationalMetricsResponse,
} from "./analytics-operational-metric-types";

function toSourceChannel(source: string): string {
  if (source.includes("webchat") || source.includes("web_chat")) {
    return "webchat";
  }

  if (source.includes("whatsapp")) {
    return "whatsapp";
  }

  if (source.includes("gmail") || source.includes("email")) {
    return "email";
  }

  return "email";
}

export class ConversationVolumeMetricsService {
  constructor(
    private readonly conversations: ConversationQueryService,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async getMetrics(input: {
    auth: AuthContext;
    query: CoreOperationalMetricsQuery;
  }): Promise<CoreOperationalMetricsResponse> {
    const scope = getAnalyticsWorkspaceScope(input.auth);
    assertSafeCoreOperationalMetricsQuery({
      query: input.query,
      authWorkspaceId: scope.workspaceId,
      expectedCategory: "operational",
    });

    const result = await this.conversations.listConversations({
      auth: input.auth,
      filters: { limit: 100 },
    });
    const conversations =
      input.query.channel === "all"
        ? result.data
        : result.data.filter(
            (conversation) =>
              toSourceChannel(conversation.source) === input.query.channel,
          );
    const byChannel = conversations.reduce<Record<string, number>>(
      (counts, conversation) => {
        const channel = toSourceChannel(conversation.source);
        counts[channel] = (counts[channel] ?? 0) + 1;
        return counts;
      },
      {},
    );
    const openCount = conversations.filter(
      (conversation) => conversation.status === "open",
    ).length;
    const closedCount = conversations.filter(
      (conversation) => conversation.status === "closed",
    ).length;
    const unresolvedCount = conversations.filter(
      (conversation) => conversation.status !== "closed",
    ).length;
    const needsAttentionCount = conversations.filter((conversation) =>
      ["open", "pending"].includes(conversation.status),
    ).length;

    return buildCoreOperationalMetricsResponse({
      workspaceId: scope.workspaceId,
      generatedAt: this.now().toISOString(),
      query: input.query,
      category: "operational" satisfies CoreOperationalCategory,
      metrics: [
        buildCoreOperationalMetric("conversation_total", conversations.length),
        buildCoreOperationalMetric("conversation_open", openCount),
        buildCoreOperationalMetric("conversation_closed", closedCount),
        buildCoreOperationalMetric("conversation_unresolved", unresolvedCount),
        buildCoreOperationalMetric(
          "conversation_by_channel",
          JSON.stringify(byChannel),
        ),
        buildCoreOperationalMetric(
          "conversation_needs_attention",
          needsAttentionCount,
        ),
      ],
    });
  }
}
