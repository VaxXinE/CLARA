import type { FastifyInstance, FastifyRequest } from "fastify";
import type { AuthContext } from "../../auth/auth-context";
import type { AppError } from "../../errors/app-error";
import { sanitizePath } from "../../logging/redaction";

type RequestWithTiming = FastifyRequest & {
  requestStartedAtNs?: bigint;
  auth?: AuthContext;
};

export type RequestLogContext = {
  method: string;
  path: string;
  status_code: number;
  duration_ms: number;
  correlation_id: string;
  organization_id?: string;
  workspace_id?: string;
  actor_user_id?: string;
  actor_role?: string;
};

export type ErrorLogContext = {
  correlation_id: string;
  method: string;
  path: string;
  status_code: number;
  error_name: string;
  error_code?: string;
  organization_id?: string;
  workspace_id?: string;
  actor_user_id?: string;
  actor_role?: string;
};

function getAuthMetadata(request: RequestWithTiming) {
  const auth = request.auth;

  if (!auth) {
    return {};
  }

  return {
    organization_id: auth.organizationId,
    workspace_id: auth.workspaceId,
    actor_user_id: auth.userId,
    actor_role: auth.role,
  };
}

function getDurationMs(request: RequestWithTiming): number {
  if (!request.requestStartedAtNs) {
    return 0;
  }

  const elapsedNs = process.hrtime.bigint() - request.requestStartedAtNs;

  return Number(elapsedNs / BigInt(1_000_000));
}

export function buildRequestLogContext(
  request: RequestWithTiming,
  statusCode: number,
): RequestLogContext {
  return {
    method: request.method,
    path: sanitizePath(request.url),
    status_code: statusCode,
    duration_ms: getDurationMs(request),
    correlation_id: request.id,
    ...getAuthMetadata(request),
  };
}

export function buildErrorLogContext(input: {
  request: RequestWithTiming;
  statusCode: number;
  error: Error | AppError;
}): ErrorLogContext {
  const appCode =
    typeof input.error === "object" &&
    input.error &&
    "appCode" in input.error &&
    typeof input.error.appCode === "string"
      ? input.error.appCode
      : undefined;

  const context = {
    correlation_id: input.request.id,
    method: input.request.method,
    path: sanitizePath(input.request.url),
    status_code: input.statusCode,
    error_name: input.error.name || "Error",
    ...getAuthMetadata(input.request),
  } as ErrorLogContext;

  if (appCode) {
    context.error_code = appCode;
  }

  return context;
}

export function registerRequestLogging<
  TApp extends FastifyInstance = FastifyInstance,
>(app: TApp): void {
  app.addHook("onRequest", async (request) => {
    (request as RequestWithTiming).requestStartedAtNs = process.hrtime.bigint();
  });

  app.addHook("onResponse", async (request, reply) => {
    request.log.info(
      buildRequestLogContext(request as RequestWithTiming, reply.statusCode),
      "HTTP request completed",
    );
  });
}
