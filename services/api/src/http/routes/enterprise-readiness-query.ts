import { ValidationError } from "../../errors/app-error";

const workspaceQueryKeys = new Set([
  "workspaceId",
  "workspace_id",
  "clientWorkspaceId",
  "client_workspace_id",
  "organizationId",
  "organization_id",
]);

export function rejectEnterpriseScopeQuery(query: Record<string, unknown>) {
  for (const key of workspaceQueryKeys) {
    if (key in query) {
      throw new ValidationError("Invalid enterprise readiness query.", [
        {
          path: `query.${key}`,
          message: "Workspace and organization scope come from server auth.",
        },
      ]);
    }
  }
}
