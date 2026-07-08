import type { FastifyRequest } from "fastify";
import { AppError, AuthenticationError } from "../errors/app-error";
import type { ProviderAuthConfig } from "./auth-config";
import type { AuthContext } from "./auth-context";
import type { AuthProvider } from "./auth-provider";

function readAuthorizationHeader(request: FastifyRequest): string | undefined {
  const value = request.headers.authorization;

  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === "string" ? value : undefined;
}

function ensureBearerToken(request: FastifyRequest): string {
  const authorization = readAuthorizationHeader(request);

  if (!authorization) {
    throw new AuthenticationError();
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AuthenticationError();
  }

  return token;
}

export class ProviderAuthProvider implements AuthProvider {
  constructor(private readonly config: ProviderAuthConfig) {}

  async authenticate(request: FastifyRequest): Promise<AuthContext> {
    ensureBearerToken(request);

    throw new AppError({
      statusCode: 501,
      appCode: "AUTH_PROVIDER_NOT_IMPLEMENTED",
      message: `Provider authentication for ${this.config.provider} is not implemented yet.`,
    });
  }
}
