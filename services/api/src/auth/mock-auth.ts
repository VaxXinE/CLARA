import type { FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { Env } from '../config/env';
import { AuthenticationError } from '../errors/app-error';
import { buildAuthContext, type AuthContext } from './auth-context';
import { roles } from './permissions';

const mockAuthHeadersSchema = z.object({
  userId: z.string().trim().min(1),
  organizationId: z.string().trim().min(1),
  workspaceId: z.string().trim().min(1),
  role: z.enum(roles)
});

function readHeader(request: FastifyRequest, name: string): string | undefined {
  const value = request.headers[name];

  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === 'string' ? value : undefined;
}

export function resolveMockAuthContext(
  request: FastifyRequest,
  env: Env
): AuthContext {
  if (!env.MOCK_AUTH_ENABLED) {
    throw new AuthenticationError();
  }

  const parsed = mockAuthHeadersSchema.safeParse({
    userId: readHeader(request, 'x-mock-user-id'),
    organizationId: readHeader(request, 'x-mock-organization-id'),
    workspaceId: readHeader(request, 'x-mock-workspace-id'),
    role: readHeader(request, 'x-mock-role')
  });

  if (!parsed.success) {
    throw new AuthenticationError();
  }

  return buildAuthContext(parsed.data);
}
