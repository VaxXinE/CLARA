import type { AuthContext } from "../auth/auth-context";
import { toBackupRestoreReadinessDto } from "./backup-restore-readiness-dto";

export class BackupRestoreReadinessService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  getReadiness(input: { auth: AuthContext }) {
    return toBackupRestoreReadinessDto({
      auth: input.auth,
      generatedAt: this.clock(),
    });
  }
}
