import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthContext } from "../../auth/auth-context";
import type { Env } from "../../config/env";
import { AppError } from "../../errors/app-error";
import { sanitizePath } from "../../logging/redaction";

type RateLimitScope = "global" | "ai_draft" | "reply_send";

type RateLimitBucket = {
  count: number;
  resetAtMs: number;
};

type TimeSource = () => number;

type RateLimitIdentity =
  | {
      kind: "auth";
      organizationId: string;
      workspaceId: string;
      userId: string;
    }
  | {
      kind: "network";
      value: string;
    };

function getNetworkIdentifier(request: FastifyRequest): string {
  return (
    request.ip || request.headers["x-forwarded-for"]?.toString() || "unknown"
  );
}

function buildGlobalRateLimitKey(request: FastifyRequest): string {
  return [
    "global",
    request.method,
    sanitizePath(request.url),
    getNetworkIdentifier(request),
  ].join(":");
}

function buildScopedIdentityKey(
  scope: Exclude<RateLimitScope, "global">,
  auth: AuthContext,
): string {
  return [scope, auth.organizationId, auth.workspaceId, auth.userId].join(":");
}

export class MemoryRateLimitStore {
  private readonly buckets = new Map<string, RateLimitBucket>();

  constructor(private readonly now: TimeSource = () => Date.now()) {}

  consume(input: { key: string; max: number; windowMs: number }): {
    allowed: boolean;
    retryAfterMs: number;
  } {
    const currentTimeMs = this.now();
    const existing = this.buckets.get(input.key);

    if (!existing || existing.resetAtMs <= currentTimeMs) {
      this.buckets.set(input.key, {
        count: 1,
        resetAtMs: currentTimeMs + input.windowMs,
      });

      return {
        allowed: true,
        retryAfterMs: 0,
      };
    }

    if (existing.count >= input.max) {
      return {
        allowed: false,
        retryAfterMs: Math.max(existing.resetAtMs - currentTimeMs, 0),
      };
    }

    existing.count += 1;
    this.buckets.set(input.key, existing);

    return {
      allowed: true,
      retryAfterMs: 0,
    };
  }
}

function createRateLimitError(): AppError {
  return new AppError({
    statusCode: 429,
    appCode: "RATE_LIMITED",
    message: "Too many requests. Please try again later.",
  });
}

export function createGlobalRateLimitPreHandler(input: {
  env: Pick<
    Env,
    "RATE_LIMIT_ENABLED" | "RATE_LIMIT_MAX" | "RATE_LIMIT_WINDOW_MS"
  >;
  store?: MemoryRateLimitStore;
}) {
  const store = input.store ?? new MemoryRateLimitStore();

  return async function globalRateLimitPreHandler(request: FastifyRequest) {
    if (!input.env.RATE_LIMIT_ENABLED) {
      return;
    }

    const result = store.consume({
      key: buildGlobalRateLimitKey(request),
      max: input.env.RATE_LIMIT_MAX,
      windowMs: input.env.RATE_LIMIT_WINDOW_MS,
    });

    if (!result.allowed) {
      throw createRateLimitError();
    }
  };
}

export function createScopedRateLimitPreHandler(input: {
  scope: Exclude<RateLimitScope, "global">;
  env: Pick<
    Env,
    | "RATE_LIMIT_ENABLED"
    | "RATE_LIMIT_WINDOW_MS"
    | "AI_DRAFT_RATE_LIMIT_MAX"
    | "REPLY_SEND_RATE_LIMIT_MAX"
  >;
  store?: MemoryRateLimitStore;
}) {
  const store = input.store ?? new MemoryRateLimitStore();

  const max =
    input.scope === "ai_draft"
      ? input.env.AI_DRAFT_RATE_LIMIT_MAX
      : input.env.REPLY_SEND_RATE_LIMIT_MAX;

  return async function scopedRateLimitPreHandler(
    request: FastifyRequest,
    _reply: FastifyReply,
  ) {
    if (!input.env.RATE_LIMIT_ENABLED) {
      return;
    }

    const auth = (request as FastifyRequest & { auth?: AuthContext }).auth;

    if (!auth) {
      throw createRateLimitError();
    }

    const result = store.consume({
      key: buildScopedIdentityKey(input.scope, auth),
      max,
      windowMs: input.env.RATE_LIMIT_WINDOW_MS,
    });

    if (!result.allowed) {
      throw createRateLimitError();
    }
  };
}
