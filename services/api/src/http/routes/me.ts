import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { getWorkspaceScope } from "../../workspace/workspace-scope";

type MeResponse = {
  user: {
    id: string;
    role: string;
  };
  organization: {
    id: string;
  };
  workspace: {
    id: string;
  };
  permissions: string[];
  auth: {
    method: "mock" | "provider";
  };
};

function buildMeResponse(
  request: Parameters<typeof getAuthContext>[0],
): MeResponse {
  const auth = getAuthContext(request);
  const scope = getWorkspaceScope(request);

  return {
    user: {
      id: auth.userId,
      role: auth.role,
    },
    organization: {
      id: scope.organizationId,
    },
    workspace: {
      id: scope.workspaceId,
    },
    permissions: auth.permissions,
    auth: {
      method: auth.authMethod,
    },
  };
}

export async function registerMeRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
): Promise<void> {
  app.get(
    "/api/v1/me",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => buildMeResponse(request),
  );
}
