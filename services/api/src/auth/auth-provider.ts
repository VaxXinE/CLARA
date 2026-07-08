import type { FastifyRequest } from "fastify";
import type { Env } from "../config/env";
import { getAuthConfig } from "./auth-config";
import type { AuthContext } from "./auth-context";
import { MockAuthProvider } from "./mock-auth-provider";
import { ProviderAuthProvider } from "./provider-auth-provider";

export interface AuthProvider {
  authenticate(request: FastifyRequest): Promise<AuthContext>;
}

export function createAuthProvider(env: Env): AuthProvider {
  const config = getAuthConfig(env);

  if (config.mode === "mock") {
    return new MockAuthProvider(env);
  }

  return new ProviderAuthProvider(config);
}
