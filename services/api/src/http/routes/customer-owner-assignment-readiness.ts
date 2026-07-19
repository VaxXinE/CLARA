import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { CustomerOwnerAssignmentReadinessService } from "../../customers/customer-owner-assignment-readiness-service";
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

export async function registerCustomerOwnerAssignmentReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: CustomerOwnerAssignmentReadinessService,
): Promise<void> {
  app.get(
    "/api/v1/customers/:customer_id/owner-assignment/readiness",
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
