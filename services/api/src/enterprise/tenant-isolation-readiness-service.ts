import type { AuthContext } from "../auth/auth-context";
import { toTenantIsolationReadinessDto } from "./tenant-isolation-readiness-dto";

export class TenantIsolationReadinessService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  getReadiness(input: { auth: AuthContext }) {
    return toTenantIsolationReadinessDto({
      auth: input.auth,
      generatedAt: this.clock(),
    });
  }
}
