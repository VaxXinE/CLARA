import { randomUUID } from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { FastifyInstance } from "fastify";

const maxCorrelationIdLength = 128;
const safeCorrelationIdPattern = /^[a-zA-Z0-9._:-]+$/;

function readHeaderValue(
  headers: IncomingMessage["headers"],
  name: string,
): string | undefined {
  const value = headers[name];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function normalizeCorrelationId(value: string | undefined): string {
  if (!value) {
    return randomUUID();
  }

  const trimmed = value.trim();

  if (
    trimmed.length === 0 ||
    trimmed.length > maxCorrelationIdLength ||
    !safeCorrelationIdPattern.test(trimmed)
  ) {
    return randomUUID();
  }

  return trimmed;
}

export function generateRequestId(request: IncomingMessage): string {
  const correlationId =
    readHeaderValue(request.headers, "x-correlation-id") ??
    readHeaderValue(request.headers, "x-request-id");

  return normalizeCorrelationId(correlationId);
}

export function registerCorrelationIdHook(app: FastifyInstance): void {
  app.addHook("onRequest", async (request, reply) => {
    reply.header("x-correlation-id", request.id);
  });
}
