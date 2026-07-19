import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { CustomerLifecycleStatusReadinessService } from "../../customers/customer-lifecycle-status-readiness-service";
import { ValidationError } from "../../errors/app-error";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const customerIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(safeIdPattern, "Invalid customer ID.");

function parseCustomerId(customerId: string): string {
  const parsed = customerIdSchema.safeParse(customerId);

  if (!parsed.success) {
    throw new ValidationError("Invalid request.", [
      {
        path: "params.customer_id",
        message: parsed.error.issues[0]?.message ?? "Invalid customer ID.",
      },
    ]);
  }

  return parsed.data;
}

export async function registerCustomerLifecycleStatusReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: CustomerLifecycleStatusReadinessService,
): Promise<void> {
  app.get(
    "/api/v1/customers/:customer_id/lifecycle-status/readiness",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const auth = getAuthContext(request);
      const params = request.params as { customer_id?: string };

      return service.getReadiness({
        auth,
        customerId: parseCustomerId(params.customer_id ?? ""),
      });
    },
  );
}
