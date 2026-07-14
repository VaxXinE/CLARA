import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import {
  organizations,
  users,
  workspaceMemberships,
  workspaces,
} from "../db/schema";
import { ConflictError } from "../errors/app-error";

export type OwnerBootstrapRepositoryInput = {
  organizationId: string;
  organizationName: string;
  workspaceId: string;
  workspaceName: string;
  providerSubject: string;
  email: string;
  displayName: string;
};

export type OwnerBootstrapRepositoryResult = {
  organizationId: string;
  workspaceId: string;
  userId: string;
  membershipId: string;
  created: boolean;
};

export interface OwnerBootstrapRepository {
  bootstrapOwner(
    input: OwnerBootstrapRepositoryInput,
  ): Promise<OwnerBootstrapRepositoryResult>;
}

type ExistingUser = {
  id: string;
  providerSubject: string | null;
  email: string;
  status: string;
};

const unsafeBootstrapMessage =
  "Owner bootstrap conflicts with existing workspace ownership.";

function isSameOwner(user: ExistingUser, input: OwnerBootstrapRepositoryInput) {
  return (
    user.providerSubject === input.providerSubject ||
    user.email.toLowerCase() === input.email.toLowerCase()
  );
}

export class DrizzleOwnerBootstrapRepository implements OwnerBootstrapRepository {
  constructor(private readonly db: Database) {}

  async bootstrapOwner(
    input: OwnerBootstrapRepositoryInput,
  ): Promise<OwnerBootstrapRepositoryResult> {
    return this.db.transaction(async (tx) => {
      await tx
        .insert(organizations)
        .values({
          id: input.organizationId,
          name: input.organizationName,
          status: "active",
        })
        .onConflictDoNothing();

      const [workspace] = await tx
        .select({
          id: workspaces.id,
          organizationId: workspaces.organizationId,
        })
        .from(workspaces)
        .where(eq(workspaces.id, input.workspaceId))
        .limit(1);

      if (workspace && workspace.organizationId !== input.organizationId) {
        throw new ConflictError(unsafeBootstrapMessage);
      }

      if (!workspace) {
        await tx.insert(workspaces).values({
          id: input.workspaceId,
          organizationId: input.organizationId,
          name: input.workspaceName,
          status: "active",
        });
      }

      const ownerRows = await tx
        .select({
          id: users.id,
          providerSubject: users.providerSubject,
          email: users.email,
          status: users.status,
        })
        .from(workspaceMemberships)
        .innerJoin(users, eq(users.id, workspaceMemberships.userId))
        .where(
          and(
            eq(workspaceMemberships.organizationId, input.organizationId),
            eq(workspaceMemberships.workspaceId, input.workspaceId),
            eq(workspaceMemberships.role, "owner"),
            eq(workspaceMemberships.status, "active"),
          ),
        );

      const existingOwner = ownerRows[0] ?? null;

      if (existingOwner && !isSameOwner(existingOwner, input)) {
        throw new ConflictError(unsafeBootstrapMessage);
      }

      const [userBySubject] = await tx
        .select()
        .from(users)
        .where(eq(users.providerSubject, input.providerSubject))
        .limit(1);
      const [userByEmail] = await tx
        .select()
        .from(users)
        .where(
          and(
            eq(users.organizationId, input.organizationId),
            eq(users.email, input.email),
          ),
        )
        .limit(1);

      if (userBySubject && userByEmail && userBySubject.id !== userByEmail.id) {
        throw new ConflictError(unsafeBootstrapMessage);
      }

      let user = userBySubject ?? userByEmail ?? null;

      if (user && user.status !== "active") {
        throw new ConflictError(unsafeBootstrapMessage);
      }

      if (
        user?.providerSubject &&
        user.providerSubject !== input.providerSubject
      ) {
        throw new ConflictError(unsafeBootstrapMessage);
      }

      if (!user) {
        const [createdUser] = await tx
          .insert(users)
          .values({
            id: `usr_${randomUUID()}`,
            organizationId: input.organizationId,
            providerSubject: input.providerSubject,
            email: input.email,
            displayName: input.displayName,
            status: "active",
          })
          .returning();
        if (!createdUser) {
          throw new ConflictError(unsafeBootstrapMessage);
        }
        user = createdUser;
      } else if (!user.providerSubject) {
        const [updatedUser] = await tx
          .update(users)
          .set({
            providerSubject: input.providerSubject,
            displayName: input.displayName,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id))
          .returning();
        if (!updatedUser) {
          throw new ConflictError(unsafeBootstrapMessage);
        }
        user = updatedUser;
      }

      if (!user) {
        throw new ConflictError(unsafeBootstrapMessage);
      }

      const [membership] = await tx
        .select()
        .from(workspaceMemberships)
        .where(
          and(
            eq(workspaceMemberships.workspaceId, input.workspaceId),
            eq(workspaceMemberships.userId, user.id),
          ),
        )
        .limit(1);

      if (membership) {
        if (membership.role !== "owner" || membership.status !== "active") {
          throw new ConflictError(unsafeBootstrapMessage);
        }

        return {
          organizationId: input.organizationId,
          workspaceId: input.workspaceId,
          userId: user.id,
          membershipId: membership.id,
          created: false,
        };
      }

      const [createdMembership] = await tx
        .insert(workspaceMemberships)
        .values({
          id: `mem_${randomUUID()}`,
          organizationId: input.organizationId,
          workspaceId: input.workspaceId,
          userId: user.id,
          role: "owner",
          status: "active",
        })
        .returning();
      if (!createdMembership) {
        throw new ConflictError(unsafeBootstrapMessage);
      }

      return {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
        userId: user.id,
        membershipId: createdMembership.id,
        created: true,
      };
    });
  }
}
