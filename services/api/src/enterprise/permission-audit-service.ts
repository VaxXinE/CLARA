import type { AuthContext } from "../auth/auth-context";
import { toPermissionAuditReadinessDto } from "./permission-audit-dto";

export class PermissionAuditReadinessService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  getReadiness(input: { auth: AuthContext }) {
    return toPermissionAuditReadinessDto({
      auth: input.auth,
      generatedAt: this.clock(),
    });
  }
}
