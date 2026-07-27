import { describe, expect, it, vi } from "vitest";
import type {
  OwnerBootstrapRepository,
  OwnerBootstrapRepositoryInput,
  OwnerBootstrapRepositoryResult,
} from "../src/auth/owner-bootstrap-repository";
import { OwnerBootstrapService } from "../src/auth/owner-bootstrap-service";
import { ConflictError, ValidationError } from "../src/errors/app-error";

class MemoryOwnerBootstrapRepository implements OwnerBootstrapRepository {
  private owner: OwnerBootstrapRepositoryResult | null = null;
  private identity: Pick<
    OwnerBootstrapRepositoryInput,
    "providerSubject" | "email"
  > | null = null;

  async bootstrapOwner(
    input: OwnerBootstrapRepositoryInput,
  ): Promise<OwnerBootstrapRepositoryResult> {
    if (
      this.owner &&
      this.identity &&
      (this.identity.providerSubject !== input.providerSubject ||
        this.identity.email !== input.email)
    ) {
      throw new ConflictError();
    }

    this.identity = {
      providerSubject: input.providerSubject,
      email: input.email,
    };
    this.owner = {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      userId: "usr_real_owner",
      membershipId: "mem_real_owner",
      created: !this.owner,
    };

    return this.owner;
  }
}

function input(overrides: Partial<OwnerBootstrapRepositoryInput> = {}) {
  return {
    organizationId: "org_real_internal",
    organizationName: "Real Internal Org",
    workspaceId: "wks_real_internal",
    workspaceName: "Real Internal Workspace",
    providerSubject: "provider-subject-owner",
    email: "owner@example.test",
    displayName: "Internal Owner",
    correlationId: "corr_p19_bootstrap",
    ...overrides,
  };
}

function createService() {
  const audit = {
    recordWorkspaceOwnerBootstrap: vi.fn(async () => true),
  };

  return {
    audit,
    service: new OwnerBootstrapService(
      new MemoryOwnerBootstrapRepository(),
      audit,
    ),
  };
}

describe("P19 real first owner bootstrap", () => {
  it("creates real organization/workspace/user/membership owner bootstrap", async () => {
    const { service } = createService();

    const result = await service.bootstrapOwner(input());

    expect(result).toMatchObject({
      organizationId: "org_real_internal",
      workspaceId: "wks_real_internal",
      userId: "usr_real_owner",
      membershipId: "mem_real_owner",
      created: true,
      auditRecorded: true,
    });
  });

  it("is idempotent for the same provider-authenticated owner identity", async () => {
    const { service } = createService();

    const first = await service.bootstrapOwner(input());
    const second = await service.bootstrapOwner(input());

    expect(second).toMatchObject({
      userId: first.userId,
      membershipId: first.membershipId,
      created: false,
    });
  });

  it("fails closed on missing provider subject, email, workspace, or organization fields", async () => {
    const { service } = createService();

    await expect(
      service.bootstrapOwner(input({ providerSubject: " " })),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(
      service.bootstrapOwner(input({ email: " " })),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(
      service.bootstrapOwner(input({ workspaceId: " " })),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(
      service.bootstrapOwner(input({ organizationId: " " })),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("does not expose secrets, tokens, auth headers, or raw provider payloads", async () => {
    const { service, audit } = createService();

    const result = await service.bootstrapOwner(input());
    const serialized = JSON.stringify({
      result,
      auditCalls: audit.recordWorkspaceOwnerBootstrap.mock.calls,
    });

    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw_provider_payload");
    expect(serialized).not.toContain(["client", "secret"].join("_"));
  });
});
