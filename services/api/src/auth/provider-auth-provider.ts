import type { FastifyRequest } from "fastify";
import { AppError } from "../errors/app-error";
import type { ProviderAuthConfig } from "./auth-config";
import type { AuthContext } from "./auth-context";
import type { AuthProvider } from "./auth-provider";
import { extractBearerToken } from "./bearer-token";

export class ProviderAuthProvider implements AuthProvider {
  constructor(private readonly config: ProviderAuthConfig) {}

  async authenticate(request: FastifyRequest): Promise<AuthContext> {
    const token = extractBearerToken(request.headers.authorization);

    return this.verifyToken(token);
  }

  private async verifyToken(_token: string): Promise<AuthContext> {
    throw new AppError({
      statusCode: 501,
      appCode: "AUTH_PROVIDER_NOT_IMPLEMENTED",
      message: `Provider authentication for ${this.config.provider} is not implemented yet.`,
    });
  }
}
