import { buildAuthContext, type AuthContext } from "./auth-context";
import type { TrustedProviderIdentity } from "./provider-identity";
import type { WorkspaceMembershipService } from "./workspace-membership-service";

export async function resolveAuthContextFromTrustedProviderIdentity(
  identity: TrustedProviderIdentity,
  workspaceMembershipService: WorkspaceMembershipService,
): Promise<AuthContext> {
  const access =
    await workspaceMembershipService.getActiveWorkspaceAccessForTrustedIdentity(
      identity,
    );

  return buildAuthContext({
    userId: access.userId,
    organizationId: access.organizationId,
    workspaceId: access.workspaceId,
    role: access.role,
    authMethod: "provider",
  });
}
