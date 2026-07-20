import type { AuthContext } from "../auth/auth-context";
import { toEvidenceReadinessDto } from "./evidence-readiness-dto";

export class EvidenceReadinessService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  getReadiness(input: { auth: AuthContext }) {
    return toEvidenceReadinessDto({
      auth: input.auth,
      generatedAt: this.clock(),
    });
  }
}
