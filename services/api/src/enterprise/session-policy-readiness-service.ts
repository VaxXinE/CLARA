import type { AuthContext } from "../auth/auth-context";
import { toSessionPolicyReadinessDto } from "./session-policy-readiness-dto";

export class SessionPolicyReadinessService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  getReadiness(input: { auth: AuthContext }) {
    return toSessionPolicyReadinessDto({
      auth: input.auth,
      generatedAt: this.clock(),
    });
  }
}
