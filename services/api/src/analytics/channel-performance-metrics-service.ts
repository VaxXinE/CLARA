import type { AuthContext } from "../auth/auth-context";
import type { ChannelHealthService } from "../channels/channel-health-service";
import { getAnalyticsWorkspaceScope } from "./analytics-read-model-policy";
import { assertSafeCoreOperationalMetricsQuery } from "./core-operational-metrics-policy";
import {
  buildCoreOperationalMetric,
  buildCoreOperationalMetricsResponse,
} from "./channel-performance-metrics-dto";
import type {
  CoreOperationalMetricsQuery,
  CoreOperationalMetricsResponse,
} from "./analytics-operational-metric-types";

function toMetricChannel(item: {
  channel: string;
  provider: string;
}): "email" | "webchat" | "whatsapp" {
  if (item.provider === "whatsapp" || item.channel === "whatsapp") {
    return "whatsapp";
  }

  if (item.provider === "webchat" || item.channel === "webchat") {
    return "webchat";
  }

  return "email";
}

export class ChannelPerformanceMetricsService {
  constructor(
    private readonly channelHealth: ChannelHealthService,
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
      expectedCategory: "channel_performance",
    });

    const health = await this.channelHealth.listHealth({ auth: input.auth });
    const items =
      input.query.channel === "all"
        ? health.data.items
        : health.data.items.filter(
            (item) => toMetricChannel(item) === input.query.channel,
          );
    const connectedCount = items.filter(
      (item) => item.status === "connected",
    ).length;
    const degradedCount = items.filter((item) =>
      ["degraded", "error", "rate_limited"].includes(item.status),
    ).length;
    const disabledCount = items.filter((item) =>
      ["disconnected", "auth_required", "unsupported"].includes(item.status),
    ).length;
    const providerStatus =
      degradedCount > 0
        ? "degraded"
        : disabledCount > 0
          ? "action_required"
          : "healthy";

    return buildCoreOperationalMetricsResponse({
      workspaceId: scope.workspaceId,
      generatedAt: this.now().toISOString(),
      query: input.query,
      category: "channel_performance",
      metrics: [
        buildCoreOperationalMetric("channel_connected_count", connectedCount),
        buildCoreOperationalMetric("channel_degraded_count", degradedCount),
        buildCoreOperationalMetric("channel_disabled_count", disabledCount),
        buildCoreOperationalMetric("inbound_sync_success_count", 0),
        buildCoreOperationalMetric("inbound_sync_failure_count", 0),
        buildCoreOperationalMetric("outbound_delivery_success_rate", 0),
        buildCoreOperationalMetric("outbound_delivery_failure_count", 0),
        buildCoreOperationalMetric("provider_health_status", providerStatus),
      ],
    });
  }
}
