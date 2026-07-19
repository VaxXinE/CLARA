import type { AuthContext } from "../auth/auth-context";
import { AuthorizationError } from "../errors/app-error";

export function assertAnalyticsOperatorFilterAllowed(input: {
  auth: AuthContext;
  operatorId?: string;
}): void {
  if (!input.operatorId) {
    return;
  }

  if (input.auth.role !== "owner") {
    throw new AuthorizationError(
      "Operator analytics filters require owner access.",
    );
  }
}
