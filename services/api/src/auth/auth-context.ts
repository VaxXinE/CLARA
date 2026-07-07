import type { FastifyRequest } from 'fastify';
import { AuthenticationError } from '../errors/app-error';
import {
  type Permission,
  type Role,
  getPermissionsForRole
} from './permissions';

export type AuthContext = {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: Role;
  permissions: Permission[];
  authMethod: 'mock';
};

export type AuthenticatedRequest = FastifyRequest & {
  auth: AuthContext;
};

export function buildAuthContext(input: {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: Role;
  authMethod?: AuthContext['authMethod'];
}): AuthContext {
  return {
    userId: input.userId,
    organizationId: input.organizationId,
    workspaceId: input.workspaceId,
    role: input.role,
    permissions: getPermissionsForRole(input.role),
    authMethod: input.authMethod ?? 'mock'
  };
}

export function setAuthContext(
  request: FastifyRequest,
  context: AuthContext
): asserts request is AuthenticatedRequest {
  (request as AuthenticatedRequest).auth = context;
}

export function getAuthContext(request: FastifyRequest): AuthContext {
  const context = (request as Partial<AuthenticatedRequest>).auth;

  if (!context) {
    throw new AuthenticationError();
  }

  return context;
}
