import type { AuthContext } from "../auth/auth-context";
import { toComplianceDashboardDto } from "./compliance-dashboard-dto";

export class ComplianceDashboardService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  getDashboard(input: { auth: AuthContext }) {
    return toComplianceDashboardDto({
      auth: input.auth,
      generatedAt: this.clock(),
    });
  }
}
