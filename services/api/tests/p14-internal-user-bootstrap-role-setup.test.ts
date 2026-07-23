import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import type {
  OwnerBootstrapRepository,
  OwnerBootstrapRepositoryInput,
  OwnerBootstrapRepositoryResult,
} from "../src/auth/owner-bootstrap-repository";
import { OwnerBootstrapService } from "../src/auth/owner-bootstrap-service";
import { ConflictError } from "../src/errors/app-error";

class MemoryOwnerBootstrapRepository implements OwnerBootstrapRepository {
  private owner: OwnerBootstrapRepositoryResult | null = null;
  private ownerIdentity: Pick<
    OwnerBootstrapRepositoryInput,
    "providerSubject" | "email"
  > | null = null;

  async bootstrapOwner(
    input: OwnerBootstrapRepositoryInput,
  ): Promise<OwnerBootstrapRepositoryResult> {
    if (
      this.owner &&
      this.ownerIdentity &&
      (this.ownerIdentity.providerSubject !== input.providerSubject ||
        this.ownerIdentity.email !== input.email)
    ) {
      throw new ConflictError();
    }

    this.ownerIdentity = {
      providerSubject: input.providerSubject,
      email: input.email,
    };
    this.owner = {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      userId: "usr_owner",
      membershipId: "mem_owner",
      created: !this.owner,
    };

    return this.owner;
  }
}

function input(overrides: Partial<OwnerBootstrapRepositoryInput> = {}) {
  return {
    organizationId: "org_internal",
    organizationName: "Internal Org",
    workspaceId: "wks_internal",
    workspaceName: "Internal Workspace",
    providerSubject: "sub_owner",
    email: "owner@example.test",
    displayName: "Internal Owner",
    correlationId: "corr_internal",
    ...overrides,
  };
}

describe("P14 internal user bootstrap role setup", () => {
  it("documents P14-PR-02 internal bootstrap and role guardrails", () => {
    const docs = [
      "docs/product/CLARA-P14-INTERNAL-USER-BOOTSTRAP-ROLE-SETUP.md",
      "docs/product/CLARA-P14-INTERNAL-ROLE-PERMISSION-MATRIX.md",
      "docs/product/CLARA-P14-INTERNAL-USER-ONBOARDING-CHECKLIST.md",
      "docs/product/CLARA-P14-INTERNAL-OWNER-ADMIN-RUNBOOK.md",
    ]
      .map((file) =>
        readFileSync(resolve(process.cwd(), "..", "..", file), "utf8"),
      )
      .join("\n");
    const normalizedDocs = docs.replace(/\s+/g, " ");

    expect(normalizedDocs).toContain("P14-PR-01 is complete");
    expect(normalizedDocs).toContain("P14-PR-02 is current");
    expect(normalizedDocs).toContain(
      "Internal user setup is for internal beta rollout",
    );
    expect(normalizedDocs).toContain(
      "owner/admin/operator/viewer roles are defined",
    );
    expect(normalizedDocs).toContain(
      "Backend AuthContext and workspace membership remain source of truth",
    );
    expect(normalizedDocs).toContain(
      "Client supplied workspaceId is not authoritative",
    );
  });

  it("bootstraps the first owner and records safe audit metadata", async () => {
    const audit = {
      recordWorkspaceOwnerBootstrap: vi.fn(async () => true),
    };
    const service = new OwnerBootstrapService(
      new MemoryOwnerBootstrapRepository(),
      audit,
    );

    const result = await service.bootstrapOwner(input());

    expect(result).toMatchObject({
      organizationId: "org_internal",
      workspaceId: "wks_internal",
      userId: "usr_owner",
      auditRecorded: true,
    });
    const auditCalls = JSON.stringify(
      audit.recordWorkspaceOwnerBootstrap.mock.calls,
    );

    expect(auditCalls).not.toContain("access_token");
    expect(auditCalls).not.toContain("refresh_token");
    expect(auditCalls).not.toContain("Authorization");
  });

  it("blocks a different user from taking over an existing owner bootstrap", async () => {
    const service = new OwnerBootstrapService(
      new MemoryOwnerBootstrapRepository(),
      { recordWorkspaceOwnerBootstrap: vi.fn(async () => true) },
    );

    await service.bootstrapOwner(input());

    await expect(
      service.bootstrapOwner(
        input({
          providerSubject: "sub_second_owner",
          email: "second-owner@example.test",
        }),
      ),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
