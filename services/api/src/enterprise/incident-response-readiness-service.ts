import type { AuthContext } from "../auth/auth-context";
import { toIncidentResponseReadinessDto } from "./incident-response-readiness-dto";

export class IncidentResponseReadinessService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  getReadiness(input: { auth: AuthContext }) {
    return toIncidentResponseReadinessDto({
      auth: input.auth,
      generatedAt: this.clock(),
    });
  }
}
