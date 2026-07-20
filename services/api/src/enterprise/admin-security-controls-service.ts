import type { AuthContext } from "../auth/auth-context";
import { toAdminSecurityControlsReadinessDto } from "./admin-security-controls-dto";

export class AdminSecurityControlsService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  getReadiness(input: { auth: AuthContext }) {
    return toAdminSecurityControlsReadinessDto({
      auth: input.auth,
      generatedAt: this.clock(),
    });
  }
}
