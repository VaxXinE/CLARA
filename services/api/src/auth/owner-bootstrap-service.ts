import type { AuditLogService } from "../audit/audit-log-service";
import { ValidationError } from "../errors/app-error";
import type {
  OwnerBootstrapRepository,
  OwnerBootstrapRepositoryInput,
  OwnerBootstrapRepositoryResult,
} from "./owner-bootstrap-repository";

export type OwnerBootstrapInput = OwnerBootstrapRepositoryInput & {
  correlationId: string;
};

export type OwnerBootstrapResult = OwnerBootstrapRepositoryResult & {
  auditRecorded: boolean;
};

function requireText(value: string, label: string): string {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new ValidationError(`${label} is required.`);
  }

  return trimmed;
}

function normalizeEmail(value: string): string {
  const email = requireText(value, "owner email").toLowerCase();

  if (!email.includes("@")) {
    throw new ValidationError("owner email must be a valid email address.");
  }

  return email;
}

export class OwnerBootstrapService {
  constructor(
    private readonly repository: OwnerBootstrapRepository,
    private readonly auditLogService: Pick<
      AuditLogService,
      "recordWorkspaceOwnerBootstrap"
    >,
  ) {}

  async bootstrapOwner(
    input: OwnerBootstrapInput,
  ): Promise<OwnerBootstrapResult> {
    const normalized: OwnerBootstrapRepositoryInput = {
      organizationId: requireText(input.organizationId, "organization id"),
      organizationName: requireText(
        input.organizationName,
        "organization name",
      ),
      workspaceId: requireText(input.workspaceId, "workspace id"),
      workspaceName: requireText(input.workspaceName, "workspace name"),
      providerSubject: requireText(input.providerSubject, "provider subject"),
      email: normalizeEmail(input.email),
      displayName: requireText(input.displayName, "owner display name"),
    };
    const correlationId = requireText(input.correlationId, "correlation id");
    const result = await this.repository.bootstrapOwner(normalized);
    const auditRecorded =
      await this.auditLogService.recordWorkspaceOwnerBootstrap({
        organizationId: result.organizationId,
        workspaceId: result.workspaceId,
        actorUserId: result.userId,
        correlationId,
        created: result.created,
      });

    return {
      ...result,
      auditRecorded,
    };
  }
}
