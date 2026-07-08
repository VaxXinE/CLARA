import type { FastifyRequest } from "fastify";
import type { Env } from "../config/env";
import type { AuthContext } from "./auth-context";
import type { AuthProvider } from "./auth-provider";
import { resolveMockAuthContext } from "./mock-auth";

export class MockAuthProvider implements AuthProvider {
  constructor(private readonly env: Env) {}

  async authenticate(request: FastifyRequest): Promise<AuthContext> {
    return resolveMockAuthContext(request, this.env);
  }
}
