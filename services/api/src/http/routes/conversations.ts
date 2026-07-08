import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getAuthContext } from '../../auth/auth-context';
import type { Env } from '../../config/env';
import { type ConversationListFilters } from '../../conversations/conversation-repository';
import {
  ConversationQueryService,
  decodeCursor
} from '../../conversations/conversation-service';
import { ValidationError } from '../../errors/app-error';
import { requireAuth } from '../../auth/require-auth';
import { conversationStatuses } from '../../db/schema';

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const conversationIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(safeIdPattern, 'Invalid conversation ID.');

const conversationListQuerySchema = z.object({
  status: z.enum(conversationStatuses).optional(),
  assigned_to: z
    .string()
    .trim()
    .min(1)
    .max(128)
    .regex(safeIdPattern, 'Invalid assigned_to value.')
    .optional(),
  search: z.string().trim().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().trim().min(1).max(512).optional()
});

function toValidationError(error: z.ZodError): ValidationError {
  return new ValidationError(
    'Invalid request.',
    error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message
    }))
  );
}

function parseConversationId(
  conversationId: string,
  path: string
): string {
  const parsed = conversationIdSchema.safeParse(conversationId);

  if (!parsed.success) {
    throw new ValidationError('Invalid request.', [
      {
        path,
        message: parsed.error.issues[0]?.message ?? 'Invalid conversation ID.'
      }
    ]);
  }

  return parsed.data;
}

function parseConversationListFilters(
  query: unknown
): ConversationListFilters {
  const parsed = conversationListQuerySchema.safeParse(query);

  if (!parsed.success) {
    throw toValidationError(parsed.error);
  }

  const filters: ConversationListFilters = {
    limit: parsed.data.limit
  };

  if (parsed.data.status) {
    filters.status = parsed.data.status;
  }

  if (parsed.data.assigned_to) {
    filters.assignedTo = parsed.data.assigned_to;
  }

  if (parsed.data.search) {
    filters.search = parsed.data.search;
  }

  if (parsed.data.cursor) {
    filters.cursor = decodeCursor(parsed.data.cursor);
  }

  return filters;
}

export async function registerConversationRoutes(
  app: FastifyInstance,
  env: Env,
  service: ConversationQueryService
): Promise<void> {
  app.get(
    '/api/v1/conversations',
    {
      preHandler: requireAuth(env)
    },
    async (request) => {
      const auth = getAuthContext(request);
      const filters = parseConversationListFilters(request.query);

      return service.listConversations({
        auth,
        filters
      });
    }
  );

  app.get(
    '/api/v1/conversations/:conversation_id',
    {
      preHandler: requireAuth(env)
    },
    async (request) => {
      const auth = getAuthContext(request);
      const params = request.params as { conversation_id?: string };
      const conversationId = parseConversationId(
        params.conversation_id ?? '',
        'params.conversation_id'
      );

      return service.getConversationDetail({
        auth,
        conversationId
      });
    }
  );
}
