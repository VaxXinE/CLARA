import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest
} from 'fastify';
import type { Env } from '../config/env';
import { isProduction } from '../config/env';

type ErrorPayload = {
  error: {
    code: string;
    message: string;
    correlation_id: string;
    details?: unknown;
  };
};

function getStatusCode(error: FastifyError): number {
  if (typeof error.statusCode === 'number') {
    return error.statusCode;
  }

  if (typeof error.validation === 'object' && error.validation !== null) {
    return 400;
  }

  return 500;
}

function getErrorCode(statusCode: number): string {
  if (statusCode === 400) {
    return 'BAD_REQUEST';
  }

  if (statusCode === 401) {
    return 'UNAUTHORIZED';
  }

  if (statusCode === 403) {
    return 'FORBIDDEN';
  }

  if (statusCode === 404) {
    return 'NOT_FOUND';
  }

  if (statusCode === 429) {
    return 'RATE_LIMITED';
  }

  return 'INTERNAL_SERVER_ERROR';
}

function getSafeMessage(
  error: FastifyError,
  statusCode: number,
  env: Env
): string {
  if (statusCode >= 500) {
    return isProduction(env)
      ? 'Unexpected server error.'
      : error.message || 'Unexpected server error.';
  }

  return error.message || 'Request failed.';
}

export function registerErrorHandlers(app: FastifyInstance, env: Env): void {
  app.setNotFoundHandler(async (request, reply) => {
    const payload: ErrorPayload = {
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found.',
        correlation_id: request.id
      }
    };

    await reply.status(404).send(payload);
  });

  app.setErrorHandler(
    async (
      error: FastifyError,
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      const statusCode = getStatusCode(error);
      const payload: ErrorPayload = {
        error: {
          code: getErrorCode(statusCode),
          message: getSafeMessage(error, statusCode, env),
          correlation_id: request.id
        }
      };

      if (!isProduction(env) && statusCode < 500 && error.validation) {
        payload.error.details = error.validation;
      }

      if (statusCode >= 500) {
        request.log.error({ err: error }, 'Unhandled API error');
      } else {
        request.log.warn({ err: error }, 'Handled API error');
      }

      await reply.status(statusCode).send(payload);
    }
  );
}
