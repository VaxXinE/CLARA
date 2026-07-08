import type {
  FastifyReply,
  FastifyRequest,
  preHandlerHookHandler,
} from "fastify";
import type { Env } from "../config/env";
import { createAuthProvider } from "./auth-provider";
import { setAuthContext } from "./auth-context";

export function requireAuth(env: Env): preHandlerHookHandler {
  const authProvider = createAuthProvider(env);

  return async function handleRequireAuth(
    request: FastifyRequest,
    _reply: FastifyReply,
  ) {
    const authContext = await authProvider.authenticate(request);
    setAuthContext(request, authContext);
  };
}
