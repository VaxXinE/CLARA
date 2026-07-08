import type {
  FastifyReply,
  FastifyRequest,
  preHandlerHookHandler,
} from "fastify";
import type { AuthProvider } from "./auth-provider";
import { setAuthContext } from "./auth-context";

export function requireAuth(authProvider: AuthProvider): preHandlerHookHandler {
  return async function handleRequireAuth(
    request: FastifyRequest,
    _reply: FastifyReply,
  ) {
    const authContext = await authProvider.authenticate(request);
    setAuthContext(request, authContext);
  };
}
