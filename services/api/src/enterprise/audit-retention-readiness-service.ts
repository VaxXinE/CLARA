import type { AuthContext } from "../auth/auth-context";
import { toAuditRetentionReadinessDto } from "./audit-retention-readiness-dto";

export class AuditRetentionReadinessService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  getReadiness(input: { auth: AuthContext }) {
    return toAuditRetentionReadinessDto({
      auth: input.auth,
      generatedAt: this.clock(),
    });
  }
}
