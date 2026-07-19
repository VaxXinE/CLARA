import type { AuthContext } from "../auth/auth-context";

export function getAnalyticsWorkspaceScope(auth: AuthContext): {
  workspaceId: string;
} {
  return {
    workspaceId: auth.workspaceId,
  };
}
