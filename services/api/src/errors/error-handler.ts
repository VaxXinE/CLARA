import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import type { Env } from "../config/env";
import { isProduction } from "../config/env";
import { buildErrorLogContext } from "../http/middleware/request-logging";
import { AppError } from "./app-error";
import { ERROR_CODES, getErrorCodeForStatusCode } from "./error-codes";

type ErrorPayload = {
  error: {
    code: string;
    message: string;
    correlation_id: string;
    details?: unknown;
  };
};

function getStatusCode(error: FastifyError): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }

  if (typeof error.statusCode === "number") {
    return error.statusCode;
  }

  if (typeof error.validation === "object" && error.validation !== null) {
    return 400;
  }

  return 500;
}

function getErrorDetails(error: FastifyError, statusCode: number, env: Env) {
  if (error instanceof AppError && statusCode < 500) {
    return error.details;
  }

  if (!isProduction(env) && statusCode < 500 && error.validation) {
    return error.validation;
  }

  return undefined;
}

function getSafeMessage(
  error: FastifyError,
  statusCode: number,
  env: Env,
): string {
  if (statusCode >= 500) {
    return isProduction(env)
      ? "Unexpected server error."
      : error.message || "Unexpected server error.";
  }

  if (statusCode === 400 && error.validation) {
    return "Invalid request.";
  }

  if (statusCode === 413) {
    return "Request payload is too large.";
  }

  if (statusCode === 429) {
    return "Too many requests. Please try again later.";
  }

  return error.message || "Request failed.";
}

function getErrorCode(error: FastifyError, statusCode: number): string {
  if (error instanceof AppError) {
    return error.appCode;
  }

  return getErrorCodeForStatusCode(statusCode);
}

export function registerErrorHandlers<
  TApp extends FastifyInstance = FastifyInstance,
>(app: TApp, env: Env): void {
  app.setNotFoundHandler(async (request, reply) => {
    const payload: ErrorPayload = {
      error: {
        code: ERROR_CODES.notFound,
        message: "Route not found.",
        correlation_id: request.id,
      },
    };

    await reply.status(404).send(payload);
  });

  app.setErrorHandler(
    async (
      error: FastifyError,
      request: FastifyRequest,
      reply: FastifyReply,
    ) => {
      const statusCode = getStatusCode(error);
      const payload: ErrorPayload = {
        error: {
          code: getErrorCode(error, statusCode),
          message: getSafeMessage(error, statusCode, env),
          correlation_id: request.id,
        },
      };

      const details = getErrorDetails(error, statusCode, env);

      if (details !== undefined) {
        payload.error.details = details;
      }

      if (statusCode >= 500) {
        request.log.error(
          buildErrorLogContext({
            request,
            statusCode,
            error,
          }),
          "Unhandled API error",
        );
      } else {
        request.log.warn(
          buildErrorLogContext({
            request,
            statusCode,
            error,
          }),
          "Handled API error",
        );
      }

      await reply.status(statusCode).send(payload);
    },
  );
}
