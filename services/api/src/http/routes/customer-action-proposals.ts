import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import {
  customerActionProposalSources,
  customerActionProposalTypes,
} from "../../customers/customer-action-proposal-policy";
import { CustomerActionProposalService } from "../../customers/customer-action-proposal-service";
import type { GetCustomerActionProposalInput } from "../../customers/customer-action-proposal-types";
import { ValidationError } from "../../errors/app-error";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const customerIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(safeIdPattern, "Invalid customer ID.");

const bodySchema = z.object({
  proposalType: z.enum(customerActionProposalTypes),
  source: z.enum(customerActionProposalSources),
  operatorInstruction: z.string().trim().max(500).optional(),
  suggestedPayload: z.record(z.unknown()).optional(),
  clientWorkspaceId: z.string().trim().max(128).optional(),
});

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

function parseBody(body: unknown): z.infer<typeof bodySchema> {
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid request.",
      parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  return parsed.data;
}

export async function registerCustomerActionProposalRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: CustomerActionProposalService,
): Promise<void> {
  app.post(
    "/api/v1/customers/:customer_id/action-proposals/review",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const auth = getAuthContext(request);
      const params = request.params as { customer_id?: string };
      const body = parseBody(request.body);

      const input: GetCustomerActionProposalInput = {
        auth,
        customerId: parseCustomerId(params.customer_id ?? ""),
        proposalType: body.proposalType,
        source: body.source,
      };

      if (body.operatorInstruction !== undefined) {
        input.operatorInstruction = body.operatorInstruction;
      }

      if (body.suggestedPayload !== undefined) {
        input.suggestedPayload = body.suggestedPayload;
      }

      if (body.clientWorkspaceId !== undefined) {
        input.clientWorkspaceId = body.clientWorkspaceId;
      }

      return service.reviewActionProposal(input);
    },
  );
}
