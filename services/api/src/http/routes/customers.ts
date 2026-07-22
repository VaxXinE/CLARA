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
    status: z
      .enum([
        "new",
        "active",
        "follow_up",
        "at_risk",
        "resolved",
        "archived",
        "blocked",
      ])
      .optional(),
    notesSummary: z.string().trim().max(500).nullable().optional(),
  })
  .strict();

const customerNoteMutationSchema = z
  .object({
    body: z.string().trim().min(1).max(2000),
  })
  .strict();

const lifecycleStatusMutationSchema = z
  .object({
    status: z.enum([
      "new",
      "active",
      "follow_up",
      "at_risk",
      "resolved",
      "archived",
      "blocked",
    ]),
  })
  .strict();

const ownerAssignmentMutationSchema = z
  .object({
    ownerUserId: z.string().trim().min(1).max(128).regex(safeIdPattern),
  })
  .strict();

const taskIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(safeIdPattern, "Invalid task ID.");

const followUpTaskCreateSchema = z
  .object({
    title: z.string().trim().min(1).max(160),
    body: z.string().trim().max(2000).nullable().optional(),
    dueAt: z.string().trim().max(40).nullable().optional(),
    assigneeUserId: z
      .string()
      .trim()
      .max(128)
      .regex(safeIdPattern)
      .nullable()
      .optional(),
  })
  .strict();

const followUpTaskUpdateSchema = z
  .object({
    status: z.enum(["open", "in_progress", "completed", "cancelled"]),
  })
  .strict();

const customerListQuerySchema = z
  .object({
    search: z.string().trim().max(120).optional(),
    status: z
      .enum([
        "new",
        "active",
        "follow_up",
        "at_risk",
        "resolved",
        "archived",
        "blocked",
      ])
      .optional(),
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

function parseTaskId(taskId: string, path: string): string {
  const parsed = taskIdSchema.safeParse(taskId);

  if (!parsed.success) {
    throw new ValidationError("Invalid request.", [
      {
        path,
        message: parsed.error.issues[0]?.message ?? "Invalid task ID.",
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

  app.get(
    "/api/v1/customers/:customer_id/notes",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const params = request.params as { customer_id?: string };
      const customerId = parseCustomerId(
        params.customer_id ?? "",
        "params.customer_id",
      );

      return service.listCustomerNotes({
        auth: getAuthContext(request),
        customerId,
      });
    },
  );

  app.post(
    "/api/v1/customers/:customer_id/notes",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request, reply) => {
      const params = request.params as { customer_id?: string };
      const customerId = parseCustomerId(
        params.customer_id ?? "",
        "params.customer_id",
      );
      const parsed = customerNoteMutationSchema.safeParse(request.body);

      if (!parsed.success) {
        throw new ValidationError("Invalid request.", parsed.error.issues);
      }

      const result = await service.createCustomerNote({
        auth: getAuthContext(request),
        customerId,
        payload: parsed.data,
        correlationId: request.id,
      });

      return reply.code(201).send(result);
    },
  );

  app.patch(
    "/api/v1/customers/:customer_id/lifecycle-status",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const params = request.params as { customer_id?: string };
      const customerId = parseCustomerId(
        params.customer_id ?? "",
        "params.customer_id",
      );
      const parsed = lifecycleStatusMutationSchema.safeParse(request.body);

      if (!parsed.success) {
        throw new ValidationError("Invalid request.", parsed.error.issues);
      }

      return service.updateCustomerLifecycleStatus({
        auth: getAuthContext(request),
        customerId,
        payload: parsed.data,
        correlationId: request.id,
      });
    },
  );

  app.patch(
    "/api/v1/customers/:customer_id/owner-assignment",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const params = request.params as { customer_id?: string };
      const customerId = parseCustomerId(
        params.customer_id ?? "",
        "params.customer_id",
      );
      const parsed = ownerAssignmentMutationSchema.safeParse(request.body);

      if (!parsed.success) {
        throw new ValidationError("Invalid request.", parsed.error.issues);
      }

      return service.assignCustomerOwner({
        auth: getAuthContext(request),
        customerId,
        payload: parsed.data,
        correlationId: request.id,
      });
    },
  );

  app.get(
    "/api/v1/customers/:customer_id/tasks",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const params = request.params as { customer_id?: string };
      const customerId = parseCustomerId(
        params.customer_id ?? "",
        "params.customer_id",
      );

      return service.listCustomerFollowUpTasks({
        auth: getAuthContext(request),
        customerId,
      });
    },
  );

  app.post(
    "/api/v1/customers/:customer_id/tasks",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request, reply) => {
      const params = request.params as { customer_id?: string };
      const customerId = parseCustomerId(
        params.customer_id ?? "",
        "params.customer_id",
      );
      const parsed = followUpTaskCreateSchema.safeParse(request.body);

      if (!parsed.success) {
        throw new ValidationError("Invalid request.", parsed.error.issues);
      }

      const result = await service.createCustomerFollowUpTask({
        auth: getAuthContext(request),
        customerId,
        payload: parsed.data,
        correlationId: request.id,
      });

      return reply.code(201).send(result);
    },
  );

  app.patch(
    "/api/v1/customers/:customer_id/tasks/:task_id",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const params = request.params as {
        customer_id?: string;
        task_id?: string;
      };
      const customerId = parseCustomerId(
        params.customer_id ?? "",
        "params.customer_id",
      );
      const taskId = parseTaskId(params.task_id ?? "", "params.task_id");
      const parsed = followUpTaskUpdateSchema.safeParse(request.body);

      if (!parsed.success) {
        throw new ValidationError("Invalid request.", parsed.error.issues);
      }

      return service.updateCustomerFollowUpTask({
        auth: getAuthContext(request),
        customerId,
        taskId,
        payload: parsed.data,
        correlationId: request.id,
      });
    },
  );

  app.get(
    "/api/v1/customers/:customer_id/activity",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const params = request.params as { customer_id?: string };
      const customerId = parseCustomerId(
        params.customer_id ?? "",
        "params.customer_id",
      );

      return service.listCustomerActivityTimeline({
        auth: getAuthContext(request),
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
