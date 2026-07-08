import type {
  FastifyReply,
  FastifyRequest,
  preHandlerHookHandler,
} from "fastify";
import type { Env } from "../config/env";
import { setAuthContext } from "./auth-context";
import { resolveMockAuthContext } from "./mock-auth";

export function requireAuth(env: Env): preHandlerHookHandler {
  return async function handleRequireAuth(
    request: FastifyRequest,
    _reply: FastifyReply,
  ) {
    const authContext = resolveMockAuthContext(request, env);
    setAuthContext(request, authContext);
  };
}
