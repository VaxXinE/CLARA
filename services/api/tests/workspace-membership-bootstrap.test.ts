import { describe, expect, it, vi } from "vitest";
import type {
  OwnerBootstrapRepository,
  OwnerBootstrapRepositoryInput,
  OwnerBootstrapRepositoryResult,
} from "../src/auth/owner-bootstrap-repository";
import { OwnerBootstrapService } from "../src/auth/owner-bootstrap-service";
import { ConflictError } from "../src/errors/app-error";

type UserRecord = {
  id: string;
  organizationId: string;
  providerSubject: string | null;
  email: string;
  status: "active" | "disabled";
};

type MembershipRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  userId: string;
  role: string;
  status: "active" | "inactive";
};

class MemoryOwnerBootstrapRepository implements OwnerBootstrapRepository {
  readonly users: UserRecord[] = [];
  readonly memberships: MembershipRecord[] = [];
  private nextUserNumber = 1;
  private nextMembershipNumber = 1;

  async bootstrapOwner(
    input: OwnerBootstrapRepositoryInput,
  ): Promise<OwnerBootstrapRepositoryResult> {
    const owners = this.memberships.filter(
      (membership) =>
        membership.organizationId === input.organizationId &&
        membership.workspaceId === input.workspaceId &&
        membership.role === "owner" &&
        membership.status === "active",
    );
    const ownerUser = owners
      .map((membership) =>
        this.users.find((user) => user.id === membership.userId),
      )
      .find(Boolean);

    if (
      ownerUser &&
      ownerUser.providerSubject !== input.providerSubject &&
      ownerUser.email !== input.email
    ) {
      throw new ConflictError();
    }

    const bySubject =
      this.users.find(
        (user) => user.providerSubject === input.providerSubject,
      ) ?? null;
    const byEmail =
      this.users.find(
        (user) =>
          user.organizationId === input.organizationId &&
          user.email === input.email,
      ) ?? null;

    if (bySubject && byEmail && bySubject.id !== byEmail.id) {
      throw new ConflictError();
    }

    let user = bySubject ?? byEmail;

    if (!user) {
      user = {
        id: `usr_test_${this.nextUserNumber++}`,
        organizationId: input.organizationId,
        providerSubject: input.providerSubject,
        email: input.email,
        status: "active",
      };
      this.users.push(user);
    } else if (!user.providerSubject) {
      user.providerSubject = input.providerSubject;
    }

    const existingMembership =
      this.memberships.find(
        (membership) =>
          membership.workspaceId === input.workspaceId &&
          membership.userId === user.id,
      ) ?? null;

    if (existingMembership) {
      if (
        existingMembership.role !== "owner" ||
        existingMembership.status !== "active"
      ) {
        throw new ConflictError();
      }

      return {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
        userId: user.id,
        membershipId: existingMembership.id,
        created: false,
      };
    }

    const membership = {
      id: `mem_test_${this.nextMembershipNumber++}`,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      userId: user.id,
      role: "owner",
      status: "active" as const,
    };
    this.memberships.push(membership);

    return {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      userId: user.id,
      membershipId: membership.id,
      created: true,
    };
  }
}

function bootstrapInput(
  overrides: Partial<OwnerBootstrapRepositoryInput> = {},
) {
  return {
    organizationId: "org_bootstrap",
    organizationName: "Bootstrap Org",
    workspaceId: "wks_bootstrap",
    workspaceName: "Bootstrap Workspace",
    providerSubject: "subject_bootstrap_owner",
    email: "owner@example.test",
    displayName: "Bootstrap Owner",
    correlationId: "corr_bootstrap",
    ...overrides,
  };
}

function createService(repository = new MemoryOwnerBootstrapRepository()) {
  const audit = {
    recordWorkspaceOwnerBootstrap: vi.fn(async () => true),
  };

  return {
    repository,
    audit,
    service: new OwnerBootstrapService(repository, audit),
  };
}

describe("workspace owner bootstrap", () => {
  it("creates the initial owner membership and writes a safe audit event", async () => {
    const { service, repository, audit } = createService();

    const result = await service.bootstrapOwner(bootstrapInput());

    expect(result).toMatchObject({
      organizationId: "org_bootstrap",
      workspaceId: "wks_bootstrap",
      created: true,
      auditRecorded: true,
    });
    expect(repository.memberships).toEqual([
      expect.objectContaining({
        role: "owner",
        status: "active",
      }),
    ]);
    expect(audit.recordWorkspaceOwnerBootstrap).toHaveBeenCalledWith({
      organizationId: "org_bootstrap",
      workspaceId: "wks_bootstrap",
      actorUserId: result.userId,
      correlationId: "corr_bootstrap",
      created: true,
    });
    expect(
      JSON.stringify(audit.recordWorkspaceOwnerBootstrap.mock.calls),
    ).not.toContain("access_token");
    expect(
      JSON.stringify(audit.recordWorkspaceOwnerBootstrap.mock.calls),
    ).not.toContain("refresh_token");
    expect(
      JSON.stringify(audit.recordWorkspaceOwnerBootstrap.mock.calls),
    ).not.toContain("cookie");
    expect(
      JSON.stringify(audit.recordWorkspaceOwnerBootstrap.mock.calls),
    ).not.toContain("raw_provider_payload");
  });

  it("is idempotent for the same provider identity and email", async () => {
    const { service } = createService();

    const first = await service.bootstrapOwner(bootstrapInput());
    const second = await service.bootstrapOwner(bootstrapInput());

    expect(second).toMatchObject({
      userId: first.userId,
      membershipId: first.membershipId,
      created: false,
    });
  });

  it("rejects unsafe ownership reassignment", async () => {
    const { service } = createService();

    await service.bootstrapOwner(bootstrapInput());

    await expect(
      service.bootstrapOwner(
        bootstrapInput({
          providerSubject: "subject_second_owner",
          email: "second-owner@example.test",
        }),
      ),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("rejects invalid bootstrap input before persistence", async () => {
    const { service, audit } = createService();

    await expect(
      service.bootstrapOwner(
        bootstrapInput({
          email: "not-an-email",
        }),
      ),
    ).rejects.toThrow("owner email must be a valid email address");
    expect(audit.recordWorkspaceOwnerBootstrap).not.toHaveBeenCalled();
  });
});
