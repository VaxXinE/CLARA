import type { AuthContext } from "../auth/auth-context";
import type { ConversationQueryService } from "../conversations/conversation-service";
import { getAnalyticsWorkspaceScope } from "./analytics-read-model-policy";
import { assertSafeCoreOperationalMetricsQuery } from "./core-operational-metrics-policy";
import {
  buildCoreOperationalMetric,
  buildCoreOperationalMetricsResponse,
} from "./response-time-sla-metrics-dto";
import type {
  CoreOperationalMetricsQuery,
  CoreOperationalMetricsResponse,
} from "./analytics-operational-metric-types";

function percentile(values: number[], rank: number): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(
    sorted.length - 1,
    Math.ceil(rank * sorted.length) - 1,
  );

  return sorted[index] ?? 0;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
}

function toSourceChannel(source: string): string {
  if (source.includes("webchat") || source.includes("web_chat")) {
    return "webchat";
  }

  if (source.includes("whatsapp")) {
    return "whatsapp";
  }

  return "email";
}

export class ResponseTimeSlaMetricsService {
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
      expectedCategory: "sla_readiness",
    });

    const list = await this.conversations.listConversations({
      auth: input.auth,
      filters: { limit: 100 },
    });
    const conversations =
      input.query.channel === "all"
        ? list.data
        : list.data.filter(
            (conversation) =>
              toSourceChannel(conversation.source) === input.query.channel,
          );
    const details = await Promise.all(
      conversations.map((conversation) =>
        this.conversations.getConversationDetail({
          auth: input.auth,
          conversationId: conversation.id,
        }),
      ),
    );
    const responseTimes = details
      .map((detail) => {
        const inbound = detail.conversation.messages.find(
          (message) => message.direction === "inbound",
        );
        const outbound = detail.conversation.messages.find(
          (message) =>
            message.direction === "outbound" &&
            inbound &&
            new Date(message.sent_at).getTime() >=
              new Date(inbound.sent_at).getTime(),
        );

        if (!inbound || !outbound) {
          return null;
        }

        return (
          new Date(outbound.sent_at).getTime() -
          new Date(inbound.sent_at).getTime()
        );
      })
      .filter((value): value is number => typeof value === "number");
    const unansweredCount = details.filter((detail) => {
      const hasInbound = detail.conversation.messages.some(
        (message) => message.direction === "inbound",
      );
      const hasOutbound = detail.conversation.messages.some(
        (message) => message.direction === "outbound",
      );

      return hasInbound && !hasOutbound;
    }).length;
    const now = this.now();
    const lastResponseAge = Math.max(
      0,
      ...conversations
        .filter((conversation) => conversation.status !== "closed")
        .map((conversation) =>
          conversation.last_message_at
            ? now.getTime() - new Date(conversation.last_message_at).getTime()
            : 0,
        ),
    );
    const slaRiskCount = conversations.filter(
      (conversation) => conversation.status !== "closed",
    ).length;

    return buildCoreOperationalMetricsResponse({
      workspaceId: scope.workspaceId,
      generatedAt: now.toISOString(),
      query: input.query,
      category: "sla_readiness",
      metrics: [
        buildCoreOperationalMetric(
          "first_response_time_avg",
          average(responseTimes),
        ),
        buildCoreOperationalMetric(
          "first_response_time_p50",
          percentile(responseTimes, 0.5),
        ),
        buildCoreOperationalMetric(
          "first_response_time_p95",
          percentile(responseTimes, 0.95),
        ),
        buildCoreOperationalMetric("last_response_age", lastResponseAge),
        buildCoreOperationalMetric("sla_risk_count", slaRiskCount),
        buildCoreOperationalMetric(
          "unanswered_conversation_count",
          unansweredCount,
        ),
      ],
    });
  }
}
