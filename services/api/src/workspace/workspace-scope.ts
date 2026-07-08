import type { FastifyRequest } from "fastify";
import type { AuthContext } from "../auth/auth-context";
import { getAuthContext } from "../auth/auth-context";

export type WorkspaceScope = {
  organizationId: string;
  workspaceId: string;
};

export function getWorkspaceScopeFromAuth(
  authContext: AuthContext,
): WorkspaceScope {
  return {
    organizationId: authContext.organizationId,
    workspaceId: authContext.workspaceId,
  };
}

export function getWorkspaceScope(request: FastifyRequest): WorkspaceScope {
  return getWorkspaceScopeFromAuth(getAuthContext(request));
}
