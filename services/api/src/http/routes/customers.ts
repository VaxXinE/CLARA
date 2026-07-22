import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { CustomerQueryService } from "../../customers/customer-service";
import { ValidationError } from "../../errors/app-error";
import { requireAuth } from "../../auth/require-auth";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const customerIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(safeIdPattern, "Invalid customer ID.");

const customerMutationSchema = z
  .object({
    displayName: z.string().trim().min(1).max(120).optional(),
    contactIdentifier: z.string().trim().max(254).nullable().optional(),
    source: z
      .enum([
        "demo",
        "whatsapp_demo",
        "whatsapp",
        "web_chat_demo",
        "email",
        "webchat",
        "extension_bridge",
      ])
      .optional(),
    status: z.enum(["new", "active", "archived", "blocked"]).optional(),
    notesSummary: z.string().trim().max(500).nullable().optional(),
  })
  .strict();

const customerListQuerySchema = z
  .object({
    search: z.string().trim().max(120).optional(),
    status: z.enum(["new", "active", "archived", "blocked"]).optional(),
  })
  .strict();

function parseCustomerId(customerId: string, path: string): string {
  const parsed = customerIdSchema.safeParse(customerId);

  if (!parsed.success) {
    throw new ValidationError("Invalid request.", [
      {
        path,
        message: parsed.error.issues[0]?.message ?? "Invalid customer ID.",
      },
    ]);
  }

  return parsed.data;
}

export async function registerCustomerRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: CustomerQueryService,
): Promise<void> {
  app.get(
    "/api/v1/customers",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const parsed = customerListQuerySchema.safeParse(request.query);

      if (!parsed.success) {
        throw new ValidationError("Invalid request.", parsed.error.issues);
      }

      return service.listCustomers({
        auth: getAuthContext(request),
        search: parsed.data.search,
        status: parsed.data.status,
      });
    },
  );

  app.get(
    "/api/v1/customers/:customer_id",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const auth = getAuthContext(request);
      const params = request.params as { customer_id?: string };
      const customerId = parseCustomerId(
        params.customer_id ?? "",
        "params.customer_id",
      );

      return service.getCustomerProfile({
        auth,
        customerId,
      });
    },
  );

  app.post(
    "/api/v1/customers",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request, reply) => {
      const parsed = customerMutationSchema.safeParse(request.body);

      if (!parsed.success) {
        throw new ValidationError("Invalid request.", parsed.error.issues);
      }

      const result = await service.createCustomer({
        auth: getAuthContext(request),
        payload: parsed.data,
        correlationId: request.id,
      });

      return reply.code(201).send(result);
    },
  );

  app.patch(
    "/api/v1/customers/:customer_id",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const params = request.params as { customer_id?: string };
      const customerId = parseCustomerId(
        params.customer_id ?? "",
        "params.customer_id",
      );
      const parsed = customerMutationSchema.safeParse(request.body);

      if (!parsed.success) {
        throw new ValidationError("Invalid request.", parsed.error.issues);
      }

      return service.updateCustomer({
        auth: getAuthContext(request),
        customerId,
        payload: parsed.data,
        correlationId: request.id,
      });
    },
  );
}
