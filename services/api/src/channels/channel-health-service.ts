import { assertPermission } from "../auth/permissions";
import type { AuthContext } from "../auth/auth-context";
import type { ChannelAccountService } from "./channel-account-service";
import type { ChannelAccountDto } from "./channel-account-types";
import { channelCapabilities } from "./channel-capabilities";
import type {
  ChannelHealthItem,
  ChannelHealthResponse,
  ChannelHealthStatus,
  ChannelReadinessLevel,
} from "./channel-health-types";
import type { ChannelProvider } from "./channel-registry-types";

function toStatus(account: ChannelAccountDto): ChannelHealthStatus {
  if (account.status === "disabled") {
    return "disconnected";
  }

  if (account.status === "disconnected") {
    return "auth_required";
  }

  if (account.health_status === "degraded") {
    return "degraded";
  }

  if (account.health_status === "unavailable") {
    return "error";
  }

  if (account.status === "connected" && account.health_status === "healthy") {
    return "connected";
  }

  return "degraded";
}

function toReadiness(provider: ChannelProvider): ChannelReadinessLevel {
  if (provider === "gmail") {
    return "production";
  }

  if (provider === "webchat" || provider === "whatsapp") {
    return "simulated";
  }

  return "planned";
}

function reasonFor(status: ChannelHealthStatus, provider: ChannelProvider) {
  if (status === "connected") {
    return "connected";
  }

  if (status === "auth_required") {
    return "auth_required";
  }

  if (status === "simulated_only") {
    return "simulated_only";
  }

  if (status === "unsupported") {
    return "official_api_required";
  }

  return `${provider}_${status}`;
}

function nextActionFor(status: ChannelHealthStatus): string {
  if (status === "connected") {
    return "No action required.";
  }

  if (status === "auth_required") {
    return "Reconnect the provider account through the approved OAuth flow.";
  }

  if (status === "simulated_only") {
    return "Use local simulation until the official provider integration is enabled.";
  }

  if (status === "unsupported") {
    return "Use only official APIs after provider approval and security review.";
  }

  return "Check provider configuration and safe server logs.";
}

function accountToHealth(
  account: ChannelAccountDto,
  workspaceId: string,
): ChannelHealthItem {
  const status = toStatus(account);

  return {
    channel: account.channel_type,
    provider: account.provider,
    status,
    readinessLevel: toReadiness(account.provider),
    workspaceId,
    accountId: account.id,
    safeSummary: `${account.display_name} is ${status}.`,
    safeReasonCode: reasonFor(status, account.provider),
    lastCheckedAt: account.last_health_checked_at,
    nextRecommendedAction: nextActionFor(status),
  };
}

function plannedHealth(
  provider: ChannelProvider,
  workspaceId: string,
): ChannelHealthItem {
  const capability = channelCapabilities.find(
    (item) => item.provider === provider,
  );
  const simulated =
    provider === "webchat" || provider === "whatsapp"
      ? "simulated_only"
      : "unsupported";

  return {
    channel: capability?.channel_type ?? "social",
    provider,
    status: simulated,
    readinessLevel: toReadiness(provider),
    workspaceId,
    accountId: null,
    safeSummary: capability?.safe_notes ?? "Provider is not connected.",
    safeReasonCode: reasonFor(simulated, provider),
    lastCheckedAt: null,
    nextRecommendedAction: nextActionFor(simulated),
  };
}

export class ChannelHealthService {
  constructor(private readonly accounts: ChannelAccountService) {}

  async listHealth(input: {
    auth: AuthContext;
  }): Promise<ChannelHealthResponse> {
    assertPermission(input.auth.role, "channel:read");

    const accountResponse = await this.accounts.listAccounts({
      auth: input.auth,
    });
    const items = accountResponse.data.items.map((account) =>
      accountToHealth(account, input.auth.workspaceId),
    );
    const seen = new Set(items.map((item) => item.provider));

    for (const capability of channelCapabilities) {
      if (!seen.has(capability.provider)) {
        items.push(plannedHealth(capability.provider, input.auth.workspaceId));
      }
    }

    return {
      data: {
        items,
      },
    };
  }
}
